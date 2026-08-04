import { readFileSync } from "node:fs";

const checks = [
  {
    file: "index.html",
    label: "Fuengirola home data",
    mustContain: [
      '"telephone": "+34952470044"',
      '"taxID": "J29227907"',
      '"Mo-Fr 06:30-23:00"',
      '"Sa 09:00-14:00"',
      '"Su 08:30-14:00"',
      '"PH 08:30-14:00"',
      "Avd. Jesús Santos Rein",
      "952 47 00 44",
      "Mensualidad 40€",
      "Estudiantes y jubilados 35€/mes",
      "Trimestre 100€",
      "Año 350€",
    ],
  },
  {
    file: "en/index.html",
    label: "Fuengirola English home data",
    mustContain: [
      '"telephone": "+34952470044"',
      '"taxID": "J29227907"',
      '"Mo-Fr 06:30-23:00"',
      '"Sa 09:00-14:00"',
      '"Su 08:30-14:00"',
      '"PH 08:30-14:00"',
      "Avd. Jesus Santos Rein",
      "+34 952 47 00 44",
      "Monthly 40€",
      "Students and pensioners 35€/month",
      "Three months 100€",
      "One year 350€",
    ],
  },
  {
    file: "horarios-contacto/index.html",
    label: "Fuengirola Spanish contact data",
    mustContain: [
      "Avd. Jesús Santos Rein",
      "Gimnasio Nuevo Estilo, S.C.",
      "CIF J-29 227 907",
      "952 47 00 44",
    ],
  },
  {
    file: "en/hours-contact/index.html",
    label: "Fuengirola English contact data",
    mustContain: [
      "Avd. Jesus Santos Rein",
      "Gimnasio Nuevo Estilo, S.C.",
      "Tax ID J-29 227 907",
      "+34 952 47 00 44",
    ],
  },
  {
    file: "servicios/index.html",
    label: "Spanish prices",
    mustContain: [
      "40€",
      "35€/mes",
      "100€",
      "350€",
      "1 día",
      "25€",
      "30€",
      "Chip de acceso",
    ],
  },
  {
    file: "en/services/index.html",
    label: "English prices",
    mustContain: [
      "40€",
      "35€/month",
      "100€",
      "350€",
      "1 day",
      "25€",
      "30€",
      "Access chip",
    ],
  },
  {
    file: "legal/index.html",
    label: "Spanish legal data",
    mustContain: [
      "Gimnasio Nuevo Estilo, S.C.",
      "CIF <strong>J-29 227 907</strong>",
      "Avd. Jesús Santos Rein",
      "952 47 00 44",
      "sábados de 9:00 a 14:00",
      "domingos y festivos de 8:30 a 14:00",
    ],
  },
  {
    file: "en/legal/index.html",
    label: "English legal data",
    mustContain: [
      "Gimnasio Nuevo Estilo, S.C.",
      "tax ID <strong>J-29 227 907</strong>",
      "Avd. Jesus Santos Rein",
      "+34 952 47 00 44",
      "Saturdays from 9:00 to 14:00",
      "Sundays and public holidays from 8:30 to 14:00",
    ],
  },
  {
    file: "arroyo/index.html",
    label: "Arroyo Spanish data",
    mustContain: [
      '"telephone": "+34951211028"',
      '"taxID": "J29227907"',
      '"Mo-Fr 06:30-23:00"',
      '"Sa-Su 09:00-14:00"',
      "Conjunto Pueblo Sol",
      "Calle Mercurio, Bloque 6",
      "951 21 10 28",
      "Gimnasio + clases: hombres 35€",
    ],
  },
  {
    file: "en/arroyo/index.html",
    label: "Arroyo English data",
    mustContain: [
      '"telephone": "+34951211028"',
      '"taxID": "J29227907"',
      '"Mo-Fr 06:30-23:00"',
      '"Sa-Su 09:00-14:00"',
      "Conjunto Pueblo Sol",
      "Calle Mercurio, Bloque 6",
      "+34 951 21 10 28",
      "Gym + classes: men 35€",
    ],
  },
  {
    file: "equipo-paco-mula/atletas/index.html",
    label: "Spanish athlete names",
    mustContain: ["Ricardo Ramirez", "Víctor Moral", "Javier Ladero Rey"],
  },
  {
    file: "en/paco-mula/athletes/index.html",
    label: "English athlete names",
    mustContain: ["Ricardo Ramirez", "Víctor Moral", "Javier Ladero Rey"],
  },
];

const forbidden = [
  { pattern: "Ricardo Rodriguez", reason: "Ricardo is Ramirez, not Rodriguez" },
  { pattern: "Ricardo Rodríguez", reason: "Ricardo is Ramirez, not Rodriguez" },
  {
    pattern: "Sa-Su 08:30-14:00",
    reason: "Fuengirola Saturdays open at 09:00",
  },
  {
    pattern: "fines de semana y festivos de 8:30 a 14:00",
    reason: "Fuengirola Saturdays open at 09:00",
  },
  {
    pattern: "weekends and public holidays from 8:30 to 14:00",
    reason: "Fuengirola Saturdays open at 09:00",
  },
];

const failures = [];

for (const check of checks) {
  const content = readFileSync(check.file, "utf8");
  for (const expected of check.mustContain) {
    if (!content.includes(expected)) {
      failures.push(
        `${check.file}: missing protected ${check.label} value: ${expected}`,
      );
    }
  }
}

for (const check of checks) {
  const content = readFileSync(check.file, "utf8");
  for (const item of forbidden) {
    if (content.includes(item.pattern)) {
      failures.push(
        `${check.file}: forbidden value "${item.pattern}" (${item.reason})`,
      );
    }
  }
}

if (failures.length) {
  console.error("Protected content checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(
    "If the business data really changed, update scripts/check-protected-content.mjs in the same reviewed change.",
  );
  process.exit(1);
}

console.log("Protected content checks OK");
