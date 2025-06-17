// Utilitários para formatação e validação
export const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
};

export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

export const validateCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (digit1 !== parseInt(cleaned.charAt(12))) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return digit2 === parseInt(cleaned.charAt(13));
};

export const getSearchType = (term) => {
  const cleaned = term.replace(/\D/g, "");

  if (cleaned.length === 11 && validateCPF(term)) {
    return { type: "cpf", formatted: formatCPF(term) };
  }

  if (cleaned.length === 14 && validateCNPJ(term)) {
    return { type: "cnpj", formatted: formatCNPJ(term) };
  }

  if (term.trim().split(" ").length >= 2) {
    return { type: "name", formatted: term.trim() };
  }

  return { type: "unknown", formatted: term };
};

export const calculateConfidenceScore = (sources, dataPoints) => {
  let score = 0;

  // Pontuação base por número de fontes
  score += Math.min(sources.length * 15, 60);

  // Pontuação por qualidade das fontes
  const highQualitySources = ["Receita Federal", "TSE", "Junta Comercial"];
  const highQualityCount = sources.filter((s) =>
    highQualitySources.includes(s)
  ).length;
  score += highQualityCount * 10;

  // Pontuação por consistência dos dados
  if (dataPoints > 5) score += 15;
  else if (dataPoints > 2) score += 10;
  else score += 5;

  // Pontuação por atualização recente
  score += 10;

  return Math.min(score, 100);
};

export const categorizeRisk = (data) => {
  let riskScore = 0;

  // Verificar inconsistências
  if (data.inconsistencies > 0) riskScore += 30;

  // Verificar dados desatualizados
  if (data.outdatedData) riskScore += 20;

  // Verificar fontes duvidosas
  if (data.questionableSources > 0) riskScore += 25;

  // Verificar baixa confiança
  if (data.confidence < 70) riskScore += 25;

  if (riskScore >= 70) return "high";
  if (riskScore >= 40) return "medium";
  return "low";
};

export const generateInsights = (searchResults, matrixResults) => {
  const insights = [];

  // Insight sobre cobertura de dados
  const totalSources = [...new Set(searchResults.map((r) => r.source))].length;
  if (totalSources >= 5) {
    insights.push({
      type: "positive",
      title: "Excelente Cobertura de Dados",
      description: `Dados encontrados em ${totalSources} fontes diferentes, garantindo alta confiabilidade.`,
    });
  }
  // Insight sobre confiança média
  const avgConfidence =
    searchResults.reduce((acc, r) => acc + r.confidence, 0) /
    searchResults.length;
  if (avgConfidence >= 90) {
    insights.push({
      type: "positive",
      title: "Alta Confiabilidade",
      description: `Confiança média de ${avgConfidence.toFixed(
        1
      )}% indica dados muito confiáveis.`,
    });
  } else if (avgConfidence < 70) {
    insights.push({
      type: "warning",
      title: "Verificação Recomendada",
      description: `Confiança média de ${avgConfidence.toFixed(
        1
      )}% sugere verificação manual dos dados.`,
    });
  }

  // Insight sobre Matrix IA
  const matrixFields = matrixResults.length;
  if (matrixFields >= 10) {
    insights.push({
      type: "positive",
      title: "Perfil Completo Identificado",
      description: `Matrix IA identificou ${matrixFields} campos de dados, criando um perfil abrangente.`,
    });
  }

  // Insight sobre dados recentes
  const recentData = searchResults.filter((r) => {
    const dataAge = Date.now() - new Date(r.timestamp).getTime();
    return dataAge < 30 * 24 * 60 * 60 * 1000; // 30 dias
  }).length;

  if (recentData / searchResults.length > 0.7) {
    insights.push({
      type: "positive",
      title: "Dados Atualizados",
      description: `${Math.round(
        (recentData / searchResults.length) * 100
      )}% dos dados são recentes (últimos 30 dias).`,
    });
  }

  // Insight sobre tipos de dados
  const dataTypes = [...new Set(searchResults.map((r) => r.type))];
  if (dataTypes.includes("fiscal") && dataTypes.includes("social")) {
    insights.push({
      type: "info",
      title: "Perfil Multidimensional",
      description:
        "Dados encontrados em múltiplas dimensões: fiscal, social e profissional.",
    });
  }

  return insights;
};

export const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToXML = (data, filename) => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<data_intel_results>
  ${data
    .map(
      (item) => `
  <result>
    ${Object.entries(item)
      .map(
        ([key, value]) => `
    <${key}>${
          typeof value === "object" ? JSON.stringify(value) : value
        }</${key}>`
      )
      .join("")}
  </result>`
    )
    .join("")}
</data_intel_results>`;

  const blob = new Blob([xmlContent], { type: "application/xml" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const maskSensitiveData = (data, fieldType) => {
  switch (fieldType) {
    case "cpf":
      return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
    case "cnpj":
      return data.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.***.***/****-$5"
      );
    case "email":
      const [user, domain] = data.split("@");
      return `${user.charAt(0)}***@${domain}`;
    case "phone":
      return data.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) ****-$3");
    default:
      return data;
  }
};

export const calculateDataQuality = (results) => {
  let qualityScore = 0;
  let factors = 0;

  // Fator 1: Confiança média
  const avgConfidence =
    results.reduce((acc, r) => acc + r.confidence, 0) / results.length;
  qualityScore += avgConfidence;
  factors++;

  // Fator 2: Diversidade de fontes
  const uniqueSources = [...new Set(results.map((r) => r.source))].length;
  const sourceScore = Math.min((uniqueSources / 10) * 100, 100);
  qualityScore += sourceScore;
  factors++;

  // Fator 3: Atualização dos dados
  const recentData = results.filter((r) => {
    const dataAge = Date.now() - new Date(r.timestamp).getTime();
    return dataAge < 90 * 24 * 60 * 60 * 1000; // 90 dias
  }).length;
  const freshnessScore = (recentData / results.length) * 100;
  qualityScore += freshnessScore;
  factors++;

  // Fator 4: Completude dos dados
  const completeResults = results.filter(
    (r) => r.content && r.content.length > 50
  ).length;
  const completenessScore = (completeResults / results.length) * 100;
  qualityScore += completenessScore;
  factors++;

  return {
    overall: Math.round(qualityScore / factors),
    confidence: Math.round(avgConfidence),
    sources: Math.round(sourceScore),
    freshness: Math.round(freshnessScore),
    completeness: Math.round(completenessScore),
  };
};

export const generateSearchSummary = (searchTerm, results, matrixResults) => {
  const searchType = getSearchType(searchTerm);
  const quality = calculateDataQuality(results);
  const insights = generateInsights(results, matrixResults);

  return {
    searchTerm: searchType.formatted,
    searchType: searchType.type,
    totalResults: results.length + matrixResults.length,
    searchResults: results.length,
    matrixResults: matrixResults.length,
    quality,
    insights,
    timestamp: new Date().toISOString(),
    sources: [...new Set(results.map((r) => r.source))],
    dataTypes: [...new Set(results.map((r) => r.type))],
  };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, "") // Remove < e >
    .replace(/javascript:/gi, "") // Remove javascript:
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

export const generateReportId = () => {
  return (
    "RPT-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).substr(2, 9)
  );
};

export const formatCurrency = (value, currency = "BRL") => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(value);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat("pt-BR", defaultOptions).format(
    new Date(date)
  );
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)(\d{4,5}-?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const generateHash = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};
