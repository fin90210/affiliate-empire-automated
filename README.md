
# Affiliate Marketing Dashboard

A modern, responsive affiliate marketing dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: Real-time statistics and performance metrics
- **Campaign Management**: Track and manage affiliate campaigns
- **Product Catalog**: Browse and promote affiliate products
- **Analytics**: Detailed performance analytics and reporting
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd affiliate-marketing-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries and data
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Key Components

- **StatsCard**: Display key performance metrics
- **RevenueChart**: Interactive revenue and conversion charts
- **CampaignTable**: Manage affiliate campaigns
- **ProductGrid**: Browse affiliate products
- **ActivityFeed**: Recent activity timeline

## Deployment

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify using the included `netlify.toml` configuration.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider.

## Configuration

- **next.config.js**: Next.js configuration
- **tsconfig.json**: TypeScript configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **netlify.toml**: Netlify deployment configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
