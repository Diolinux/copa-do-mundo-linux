
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# 2. Copy package.json and package-lock.json from apps/web
RUN mkdir -p apps/web
COPY apps/web/package*.json ./apps/web/

# 3. Run 'npm install' at the root level to install all monorepo dependencies
RUN npm install

# 4. Copy the entire source code
COPY . .

# 5. Create the required distroData.js file with exactly 32 valid Linux distributions BEFORE build
RUN mkdir -p apps/web/src/data && \
    cat << 'EOF' > apps/web/src/data/distroData.js
export const distroData = [
  { id: 1, name: "Ubuntu", emoji: "🟠", description: "Debian-based OS for PCs and servers.", category: "Desktop", popularity: 100, flag: "🇬🇧", base: "Debian" },
  { id: 2, name: "Fedora", emoji: "🎩", description: "Bleeding-edge tech sponsored by Red Hat.", category: "General", popularity: 95, flag: "🇺🇸", base: "Independent" },
  { id: 3, name: "Debian", emoji: "🌀", description: "The universal operating system.", category: "General", popularity: 90, flag: "🇺🇸", base: "Independent" },
  { id: 4, name: "Arch Linux", emoji: "🦅", description: "Keep it simple, lightweight.", category: "Power User", popularity: 88, flag: "🇨🇦", base: "Independent" },
  { id: 5, name: "CentOS", emoji: "🏢", description: "Community Enterprise OS.", category: "Server", popularity: 85, flag: "🇺🇸", base: "RHEL" },
  { id: 6, name: "openSUSE", emoji: "🦎", description: "Makers' choice for sysadmins.", category: "General", popularity: 82, flag: "🇩🇪", base: "Independent" },
  { id: 7, name: "Linux Mint", emoji: "🌿", description: "From freedom came elegance.", category: "Desktop", popularity: 98, flag: "🇮🇪", base: "Ubuntu" },
  { id: 8, name: "Elementary OS", emoji: "✨", description: "Fast, open, and privacy-respecting.", category: "Desktop", popularity: 80, flag: "🇺🇸", base: "Ubuntu" },
  { id: 9, name: "Zorin OS", emoji: "💎", description: "Make your computer better.", category: "Desktop", popularity: 84, flag: "🇮🇪", base: "Ubuntu" },
  { id: 10, name: "Pop!_OS", emoji: "🚀", description: "An OS for the software developer.", category: "Desktop", popularity: 86, flag: "🇺🇸", base: "Ubuntu" },
  { id: 11, name: "Manjaro", emoji: "🟩", description: "Enjoy the simplicity.", category: "Desktop", popularity: 87, flag: "🇫🇷", base: "Arch" },
  { id: 12, name: "Endeavour OS", emoji: "🚀", description: "Arch-based rolling release.", category: "General", popularity: 83, flag: "🇳🇱", base: "Arch" },
  { id: 13, name: "Garuda Linux", emoji: "🦅", description: "Performance-focused Arch.", category: "Gaming", popularity: 76, flag: "🇮🇳", base: "Arch" },
  { id: 14, name: "Solus", emoji: "⛵", description: "Designed for home computing.", category: "Desktop", popularity: 68, flag: "🇮🇪", base: "Independent" },
  { id: 15, name: "Void Linux", emoji: "🌌", description: "Rolling release system.", category: "Power User", popularity: 65, flag: "🇪🇸", base: "Independent" },
  { id: 16, name: "NixOS", emoji: "❄️", description: "Declarative configuration.", category: "Power User", popularity: 70, flag: "🇳🇱", base: "Independent" },
  { id: 17, name: "Gentoo", emoji: "🐧", description: "Extreme configurability.", category: "Power User", popularity: 60, flag: "🇺🇸", base: "Independent" },
  { id: 18, name: "Slackware", emoji: "🚬", description: "The oldest maintained distro.", category: "Power User", popularity: 50, flag: "🇺🇸", base: "Independent" },
  { id: 19, name: "AlmaLinux", emoji: "🦙", description: "Enterprise-grade server OS.", category: "Server", popularity: 78, flag: "🇺🇸", base: "RHEL" },
  { id: 20, name: "Rocky Linux", emoji: "🏔️", description: "Community enterprise operating system.", category: "Server", popularity: 79, flag: "🇺🇸", base: "RHEL" },
  { id: 21, name: "Oracle Linux", emoji: "🏢", description: "Enterprise Linux by Oracle.", category: "Server", popularity: 70, flag: "🇺🇸", base: "RHEL" },
  { id: 22, name: "Kali Linux", emoji: "🐉", description: "Penetration testing.", category: "Security", popularity: 85, flag: "🇺🇸", base: "Debian" },
  { id: 23, name: "Parrot OS", emoji: "🦜", description: "Security and development.", category: "Security", popularity: 75, flag: "🇮🇹", base: "Debian" },
  { id: 24, name: "Tails", emoji: "👻", description: "Privacy-focused live OS.", category: "Security", popularity: 74, flag: "🇺🇸", base: "Debian" },
  { id: 25, name: "Whonix", emoji: "🛡️", description: "Anonymity OS based on Tor.", category: "Security", popularity: 60, flag: "🇺🇸", base: "Debian" },
  { id: 26, name: "Qubes OS", emoji: "🧊", description: "A reasonably secure OS.", category: "Security", popularity: 65, flag: "🇺🇸", base: "Fedora" },
  { id: 27, name: "Fedora Silverblue", emoji: "🔵", description: "Immutable desktop OS.", category: "Desktop", popularity: 68, flag: "🇺🇸", base: "Fedora" },
  { id: 28, name: "Fedora Kinoite", emoji: "🖌️", description: "Immutable KDE desktop OS.", category: "Desktop", popularity: 62, flag: "🇺🇸", base: "Fedora" },
  { id: 29, name: "Fedora CoreOS", emoji: "⚙️", description: "Container-focused OS.", category: "Server", popularity: 66, flag: "🇺🇸", base: "Fedora" },
  { id: 30, name: "Endless OS", emoji: "♾️", description: "Flatpak-based desktop system.", category: "Desktop", popularity: 55, flag: "🇺🇸", base: "Debian" },
  { id: 31, name: "Alpine Linux", emoji: "⛰️", description: "Security-oriented, lightweight.", category: "Minimal", popularity: 85, flag: "🇺🇸", base: "Independent" },
  { id: 32, name: "MX Linux", emoji: "📦", description: "Midweight, stable OS.", category: "General", popularity: 89, flag: "🇬🇷", base: "Debian" }
];
EOF

# 6. Execute generate-llms.js if present (which may override with real fetched data), then build
RUN cd apps/web && (node tools/generate-llms.js || true)
RUN cd apps/web && npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve to host the static files
RUN npm install -g serve

# Copy the built assets from the builder stage
COPY --from=builder /app/dist/apps/web ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the application in production mode
CMD ["serve", "-s", "dist", "-l", "3000"]
