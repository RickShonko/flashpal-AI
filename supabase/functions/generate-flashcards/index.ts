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

    // Initialize Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Generate flashcards using AI
    const prompt = `Create flashcards from the following notes. Generate exactly 10 question-answer pairs. Format as JSON array with objects containing "front" (question) and "back" (answer) properties. Make questions diverse and cover key concepts. Here are the notes:

${notes}

Return only valid JSON in this format:
[{"front": "question 1", "back": "answer 1"}, {"front": "question 2", "back": "answer 2"}]`

    console.log('Calling Hugging Face API...')
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false
      }
    })

    console.log('AI Response:', response.generated_text)

    // Try to extract JSON from the response
    let flashcards
    try {
      // Look for JSON array in the response
      const jsonMatch = response.generated_text.match(/\[.*\]/s)
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response, creating fallback flashcards')
      // Create fallback flashcards if AI parsing fails
      const chunks = notes.split('.').filter(chunk => chunk.trim().length > 10).slice(0, 5)
      flashcards = chunks.map((chunk, index) => ({
        front: `What is the main concept in: "${chunk.trim().substring(0, 50)}..."?`,
        back: chunk.trim()
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