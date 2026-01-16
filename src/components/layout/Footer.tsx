import { Heart, Mail, Github, Linkedin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8" />
            <span className="font-bold text-xl">CommunityHealth (MediBot)</span>
          </div>
          <p className="text-sm opacity-80 mb-6 max-w-md">
            AI-Driven Health Assistant for Communities. Supporting SDG 3: Good Health and Well-Being.
          </p>
          <div className="flex gap-4 mb-6">
            <a href="mailto:cnwafor435@gmail.com" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://github.com/John36-collab" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="tel:+2349116213978" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
              <Phone className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm opacity-70">Built by Nwafor John Chukwuebuka</p>
          <p className="text-xs opacity-50 mt-2">© 2025 CommunityHealth (MediBot). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
