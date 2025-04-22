import React, { useState, useEffect } from "react";
import MatchFixingSection from "../../components/sigap/antifraude/MatchFixingSection";
import ArbitrageBettingSection from "../../components/sigap/antifraude/ArbitrageBettingSection";
import MultiAccountSection from "../../components/sigap/antifraude/MultiAccountSection";
import BonusAbuseSection from "../../components/sigap/antifraude/BonusAbuseSection";
import InsiderBettingSection from "../../components/sigap/antifraude/InsiderBettingSection";
import PaymentFraudSection from "../../components/sigap/antifraude/PaymentFraudSection";
import TechnicalExploitsSection from "../../components/sigap/antifraude/TechnicalExploitsSection";
import FraudAlertPanel from "../../components/sigap/antifraude/FraudAlertPanel";
import FraudStatsSummary from "../../components/sigap/antifraude/FraudStatsSummary";
import FilterPanel from "../../components/sigap/antifraude/FilterPanel";

const Antifraude = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedSports, setSelectedSports] = useState([
    "Futebol",
    "Tênis",
    "Basquete",
  ]);
  const [riskLevel, setRiskLevel] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [fraudStats, setFraudStats] = useState({
    totalAlerts: 0,
    highRiskAlerts: 0,
    mediumRiskAlerts: 0,
    lowRiskAlerts: 0,
    resolvedAlerts: 0,
  });

  // Simulated data loading
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call
    const fetchData = setTimeout(() => {
      // Mock data
      setFraudStats({
        totalAlerts: 127,
        highRiskAlerts: 23,
        mediumRiskAlerts: 48,
        lowRiskAlerts: 56,
        resolvedAlerts: 89,
      });

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(fetchData);
  }, [timeRange, selectedSports, riskLevel]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSportsChange = (sports) => {
    setSelectedSports(sports);
  };

  const handleRiskLevelChange = (level) => {
    setRiskLevel(level);
  };

  return (
    <div className="p-6 max-w-8xl w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Sistema Antifraude - Monitoramento e Detecção
      </h1>

      {/* Fraud Stats Summary */}
      <FraudStatsSummary stats={fraudStats} isLoading={isLoading} />

      {/* Filter Panel */}
      <FilterPanel
        timeRange={timeRange}
        selectedSports={selectedSports}
        riskLevel={riskLevel}
        onTimeRangeChange={handleTimeRangeChange}
        onSportsChange={handleSportsChange}
        onRiskLevelChange={handleRiskLevelChange}
      />

      {/* Fraud Alert Panel - Recent high priority alerts */}
      <FraudAlertPanel isLoading={isLoading} />

      {/* Technical Exploits Section */}
      <TechnicalExploitsSection timeRange={timeRange} isLoading={isLoading} />

      {/* Payment Fraud Section */}
      <PaymentFraudSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />

      {/* Match Fixing Section */}
      <MatchFixingSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />

      {/* Arbitrage Betting Section */}
      <ArbitrageBettingSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />

      {/* Multi-Account Section */}
      <MultiAccountSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />

      {/* Bonus Abuse Section */}
      <BonusAbuseSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />

      {/* Insider Betting Section */}
      <InsiderBettingSection
        timeRange={timeRange}
        selectedSports={selectedSports}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Antifraude;
