# Koi Core API

Koi Core API is a backend web service application for managing Influencer/KOL data. This application supports functionalities such as authentication, creating, reading, updating, and deleting Influencer/KOL data, and integrates with third-party authentication services like Google.

## Features

- User authentication using JWT and Google OAuth
- CRUD operations for Influencer/KOL data
- Email verification for user sign-up
- Unit tests with Jest
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/koi-core-api--idealab-entrance.git
    cd koi-core-api--idealab-entrance
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `config/default.json` file in the root directory and add the following variables:

    ```json
    {
      "host": "localhost",
      "port": 3030,
      "mongodb": "mongodb://localhost:27017/koi-core-api",
      "authentication": {
        "secret": "your_jwt_secret",
        "entity": "user",
        "service": "users",
        "authStrategies": ["jwt", "local"],
        "jwtOptions": {
          "expiresIn": "1d"
        },
        "oauth": {
          "redirect": "/",
          "google": {
            "key": "your_google_client_id",
            "secret": "your_google_client_secret"
          }
        }
      },
      "postmark": {
        "apiKey": "your_postmark_api_key"
      }
    }
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

### Running Tests

To run the unit tests:

```bash
npm test
```

## Linting and Formatting
To lint the code:

```bash
Copy code
npm run lint
```

To fix linting errors:

```bash
Copy code
npm run lint:fix
```

To check code formatting with Prettier:

```bash
Copy code
npm run prettier
```

To fix code formatting with Prettier:

```bash
Copy code
npm run prettier:fix
```

## Building the Project
To build the project for production:

```bash
Copy code
npm run build
```

To start the built project:

```bash
Copy code
npm run start:prod
```

## Docker
To build the Docker image:

```bash
Copy code
npm run docker:build
```

To run the Docker container:

```bash
Copy code
npm run docker:run
```

## API Documentation
API documentation is generated using Swagger. To view the API documentation, start the server and navigate to /swagger in your browser.

## Contributing
Feel free to submit issues or pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


