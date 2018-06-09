For local dev run ```npm run dev```

## Real Cert method
Generate a real ssl cert from Lets Encrypt by using a domain you control and only want to use for local dev like "local.example.org"
Use those certs

## Local Certs Method (I couldn't make this work)
Generate an SSL cert with the following
```
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

Add the server.crt to your system (on a mac this is via the Keychain Access app)
If using chrome, you'll want to allow insecure localhost. Paste this into the URL bar: ```chrome://flags/#allow-insecure-localhost```
If using Firefox, you'll also need to add a server exception under Preferences > Security > View Certificates > Servers > Add Exception
