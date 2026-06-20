
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton({ distroName, platform = 'twitter' }) {
  const url = window.location.origin;
  const message = `Minha distro Linux campeã da Copa do Mundo de Distros é ${distroName}! 🏆 Qual é a sua? Jogue agora: ${url}`;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`
  };

  const platformNames = {
    twitter: 'Twitter/X',
    facebook: 'Facebook',
    whatsapp: 'WhatsApp'
  };

  const handleShare = async () => {
    // Try native Web Share API first
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title: 'Copa do Mundo de Distros Linux',
          text: message,
          url: url
        });
        return;
      } catch (err) {
        // User cancelled or error - fall through to URL method
      }
    }

    // Open share URL in new window
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      toast.success(`Compartilhando no ${platformNames[platform]}`);
    }
  };

  const icons = {
    twitter: '𝕏',
    facebook: 'f',
    whatsapp: '💬'
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="lg"
      className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
    >
      <span className="text-xl">{icons[platform] || <Share2 className="w-5 h-5" />}</span>
      {platformNames[platform] || 'Compartilhar'}
    </Button>
  );
}
