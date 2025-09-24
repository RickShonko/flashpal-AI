import { Brain, Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg hero-gradient">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FlashPal</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered study companion that transforms your notes into interactive flashcards. Study smarter, not harder.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2 text-sm">
              <a href="#features" className="block hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="block hover:text-primary transition-colors">Pricing</a>
              <a href="#demo" className="block hover:text-primary transition-colors">Demo</a>
              <a href="#api" className="block hover:text-primary transition-colors">API</a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <a href="#help" className="block hover:text-primary transition-colors">Help Center</a>
              <a href="#contact" className="block hover:text-primary transition-colors">Contact Us</a>
              <a href="#docs" className="block hover:text-primary transition-colors">Documentation</a>
              <a href="#status" className="block hover:text-primary transition-colors">System Status</a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <a href="#privacy" className="block hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#terms" className="block hover:text-primary transition-colors">Terms of Service</a>
              <a href="#cookies" className="block hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#security" className="block hover:text-primary transition-colors">Security</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 FlashPal. All rights reserved.Eric Shonko. Built with ❤️ for the KATTI Regional Competition.</p>
        </div>
      </div>
    </footer>
  );
};