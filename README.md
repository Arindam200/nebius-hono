
![Nebius AI + Hono + Cloudflare Example](https://github.com/user-attachments/assets/31a5c013-fb4e-4ea0-a764-7554945597bf)

# Nebius AI + Hono + Cloudflare Example

This is a project to provide an example of using [Nebius AI](https://dub.sh/nebius) with Hono.

## Features

- **Minimal & Lightweight:** Built with Hono and React for a streamlined, easy-to-follow example.
- **Multi-Model Support:** Easily switch between Nebius AI models like Deepseek R1, Meta-Llama, and others.
- **Real-Time Streaming:** Displays streaming responses from the AI in real time.
- **Input Validation:** Utilizes Zod for validating incoming data.
- **Dual Rendering:** Supports both server-side and client-side rendering.

## Requirements

- **Node.js** v18+ 
- **Nebius Account** (For Inference Models)
- **Cloudflare Account** (for deploying to Cloudflare Pages/Workers)

## Installation

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/Arindam200/nebius-hono.git
   cd nebius-hono
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables:**

   This project uses environment variables to configure your Nebius API key. You can set the variable using one of the following methods:

   - **.env File:** Create a `.env` file in the root directory (or copy from `.env.example`) with the following content:

     ```env
     VITE_NEBIUS_API_KEY="Your NEBIUS API KEY"
     ```

   - **.dev.vars File:** When developing for Cloudflare Workers or if you prefer to keep your secrets separate, you can alternatively define your environment variables inside a `.dev.vars` file. This file is automatically detected by the Hono environment adapter. For example:

     ```env
     NEBIUS_API_KEY="Your NEBIUS API KEY"
     ```

## Development

Start the development environment using Vite:

```sh
npm run dev
```

Then open your browser at [http://localhost:5173/](http://localhost:5173/) to interact with the chat application.

<img width="1710" alt="Screenshot 2025-02-11 at 8 04 01 PM" src="https://github.com/user-attachments/assets/9058ad81-be7f-4301-97c8-aa075ab6f492" />


## Deployment

To build and deploy the project to Cloudflare Pages, follow these steps:

1. **Build the Application:**

   The following command builds both the client and server bundles:

   ```sh
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**

   Use the Wrangler CLI (configured via `wrangler.toml`) to deploy:

   ```sh
   npm run deploy
   ```

> **💡 Note:** 
> 
> In a production environment, ensure that the `VITE_NEBIUS_API_KEY` (or `NEBIUS_API_KEY` if using a `.dev.vars` file) environment variable is set in your hosting platform's environment settings.

## Project Structure

```
.
├── .env                      # Local environment variables file
├── .env.example              # Example environment variables file
├── .dev.vars                # Development environment variables for Cloudflare Workers
├── package.json              # Project manifest and scripts
├── README.md                 # Project documentation
├── wrangler.toml             # Cloudflare Pages/Workers configuration
├── vite.config.ts            # Vite configuration file
└── src
    ├── client.tsx            # React-based client entry point
    ├── index.tsx             # Hono server/API entry point
    ├── renderer.tsx          # React renderer for Hono pages
    └── styles.css            # Application and component-specific styles
```

## Configuration

### Environment Variables

- **VITE_NEBIUS_API_KEY / NEBIUS_API_KEY:**  
  This key is essential for your application to interact with the Nebius AI API. Use the `VITE_NEBIUS_API_KEY` variable in the `.env` file for local development with Vite or use `NEBIUS_API_KEY` in `.dev.vars` if you’re working with Cloudflare Workers.

### Switching AI Models

By default, the project uses a Nebius AI model defined in `src/index.tsx`. To switch between models (e.g., from Meta-Llama to Deepseek R1), update the `model` parameter in the AI API call:

```typescript
const result = await client.chat.completions.create({
  temperature: 0.6,
  model: "meta-llama/Meta-Llama-3.1-70B-Instruct", // Or change to "deepseek/R1"
  messages: messages,
});
```

This allows you to quickly swap models based on your current requirements.

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, please open an issue or submit a pull request. Ensure that any contributions adhere to the project's style and testing guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full license text.

## Support

If you encounter issues or have any questions, please open an issue in the GitHub repository or contact the maintainers directly.
