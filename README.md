# Business Calendar Generator

A comprehensive web application for generating business calendars with automatic event scheduling, PDF export, CSV export, and Outlook calendar integration.

## 🚀 Features

### ✨ **Smart Event Management**
- **Editable Text Interface**: Simple textarea for defining business events
- **Intelligent Date Parsing**: Automatically handles complex scheduling rules
- **Weekend Logic**: Smart handling of weekends with "next working day" and "previous Friday" rules
- **Pre-loaded Events**: Comes with common business events (monthend, allocations, etc.)

### 📅 **Calendar Display**
- **12-Month View**: Complete yearly calendar with responsive grid layout
- **Visual Event Indicators**: Color-coded events with clear date highlighting
- **Event Details**: Hover tooltips showing full event information
- **Professional Design**: Clean, readable calendar layout

### 📊 **Export Options**
1. **📄 PDF Calendar**: Professional calendar with visual event differentiation
2. **📊 CSV Export**: Structured data export for analysis
3. **📅 Outlook Integration**: .ics file generation for calendar imports

### 🎯 **Outlook Calendar Integration**
- **Automatic Import**: One-click .ics file download
- **Smart Reminders**: 1-day advance notifications for all events
- **Professional Formatting**: Proper event categorization and metadata
- **Universal Compatibility**: Works with Outlook, Apple Calendar, Google Calendar

## 🛠️ **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/CGunasekaran/outlook-calendar.git
cd outlook-calendar

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
