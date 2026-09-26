const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const yaml = require("yaml");

const environment = process.argv[2];

if (!environment) {
    console.error("❌ Informe o ambiente.");
    console.error("Exemplo: npm run build:apk -- dev");
    process.exit(1);
}

const valuesPath = path.resolve(
    `.cd/${environment}/values-${environment}.yaml`
);

if (!fs.existsSync(valuesPath)) {
    console.error(`❌ Arquivo não encontrado: ${valuesPath}`);
    process.exit(1);
}

console.log(`📦 Ambiente: ${environment}`);
console.log(`📄 Values: ${valuesPath}`);

const values = yaml.parse(
    fs.readFileSync(valuesPath, "utf8")
);

if (!Array.isArray(values.environment)) {
    console.error(
        "❌ O arquivo values não possui uma propriedade 'environment' válida."
    );
    process.exit(1);
}

const environmentVariables = Object.fromEntries(
    values.environment.map(({ name, value }) => [
        name,
        value
    ])
);

const envContent = Object.entries(environmentVariables)
    .map(([name, value]) => `EXPO_PUBLIC_${name}=${value}`)
    .join("\n") + "\n";

const envPath = path.resolve(".env");

fs.writeFileSync(envPath, envContent);

console.log("\n🔧 Variáveis carregadas:");

for (const name of Object.keys(environmentVariables)) {
    console.log(`   EXPO_PUBLIC_${name}=***`);
}

console.log("\n🚀 Iniciando EAS Build...\n");

try {
    execSync(
        "eas build --platform android --profile preview",
        {
            stdio: "inherit"
        }
    );
} finally {
    if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
        console.log("\n🧹 .env temporário removido.");
    }
}