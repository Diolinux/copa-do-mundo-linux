
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-auto border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Feito por{' '}
            <a 
              href="https://diolinux.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent font-bold hover:underline transition-all"
            >
              Diolinux
            </a>
          </p>
          <p className="text-sm text-secondary-foreground/70 mt-2">
            © {currentYear} Copa do Mundo de Distros Linux
          </p>
        </div>
      </div>
    </footer>
  );
}
