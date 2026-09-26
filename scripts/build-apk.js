const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const yaml = require("yaml");

const environment = process.argv[2];

if (!environment) {
    console.error("Informe o ambiente.");
    console.error("Exemplo: npm run build:apk -- dev");
    process.exit(1);
}

const valuesFile = path.resolve(
    `.cd/${environment}/values-${environment}.yaml`
);

if (!fs.existsSync(valuesFile)) {
    console.error(`Arquivo não encontrado: ${valuesFile}`);
    process.exit(1);
}

console.log(`\nAmbiente: ${environment}`);
console.log(`Values:   ${valuesFile}\n`);

const values = yaml.parse(
    fs.readFileSync(valuesFile, "utf8")
);

const env = {
    ...process.env,

    EXPO_PUBLIC_API_BASE_URL: values.API_BASE_URL,
    EXPO_PUBLIC_APP_DEEP_LINK: values.APP_DEEP_LINK
};

execSync(
    "eas build --platform android --profile preview",
    {
        stdio: "inherit",
        env
    }
);