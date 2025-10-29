import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-primary text-primary-foreground mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4" />
              <span>support@evalscript.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4" />
              <span>123 Education St, Learning City</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-accent transition-smooth">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-smooth">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-lg mb-4">About EvalScript</h3>
            <p className="text-sm text-primary-foreground/80">
              Your trusted partner in academic evaluation. Streamline your grading process with
              our modern, efficient answer script evaluation system.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" /> for
            educators worldwide
          </p>
          <p className="mt-2 text-primary-foreground/60">
            © 2025 EvalScript. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
