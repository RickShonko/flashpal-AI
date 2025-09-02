import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { notes, deckId } = await req.json()
    console.log('Generating flashcards for deck:', deckId)

    // Get the authorization header and extract the JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client with the JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Prepare AI prompt
    const prompt = `Create flashcards from the following notes. Generate exactly 10 question-answer pairs. Format as JSON array with objects containing "front" (question) and "back" (answer) properties. Make questions diverse and cover key concepts. Here are the notes:

${notes}

Return only valid JSON in this format:
[{"front": "question 1", "back": "answer 1"}, {"front": "question 2", "back": "answer 2"}]`

    let flashcards: Array<{ front: string; back: string }> | null = null

    // Try AI first
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    try {
      if (!hfToken) throw new Error('Missing HUGGING_FACE_ACCESS_TOKEN')

      const hf = new HfInference(hfToken)
      console.log('Calling Hugging Face API...')
      const response = await hf.textGeneration({
        // Zephyr is lightweight and instruction-tuned
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          return_full_text: false
        }
      })

      console.log('AI Response:', response.generated_text)

      // Try to extract JSON from the response
      const jsonMatch = response.generated_text.match(/\[.*\]/s)
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (aiError) {
      console.error('AI generation failed, using heuristic fallback:', aiError)
      // Heuristic fallback: create Q/A from sentences in notes
      const sentences = notes
        .replace(/\n+/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 20)

      const selected = sentences.slice(0, Math.min(10, sentences.length))
      flashcards = selected.map((s, i) => ({
        front: `Q${i + 1}: What is the key idea of: "${s.trim().substring(0, 80)}"?`,
        back: s.trim()
      }))
    }

    // Ensure we have valid flashcards
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Failed to generate valid flashcards')
    }

    // Insert flashcards into database
    console.log('Inserting flashcards into database...')
    const flashcardsToInsert = flashcards.map(card => ({
      deck_id: deckId,
      front: card.front,
      back: card.back
    }))

    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Successfully created ${data.length} flashcards`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        flashcards: data,
        count: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate flashcards', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})