"use client";
import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Search,
  Zap,
  Eye,
  Activity,
  AlertTriangle,
  Gauge,
  Building2,
  Wallet,
  Lock,
  Users,
  Copy,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Target,
  Microscope,
  Filter,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  Fuel,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  Share2,
  Bookmark,
  Download,
  Calendar,
  Globe,
  BarChart3,
  DollarSign,
  ArrowUpDown,
  Info,
  FileText,
  Radar,
  Shield,
  X,
  ShieldCheck,
  Database,
  Brain,
  AlertOctagonIcon,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced demo data with more realistic blockchain investigation scenarios
const DEMO_ADDRESSES = {
  wallet: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  contract: "0xA0b86a33E6441e8e5c3F27d9C5C8b8b8b8b8b8b8",
  scam: "0xScam123456789abcdef0123456789abcdef012345",
  defi: "0xDeFi789012345abcdef0123456789abcdef012345",
  exchange: "0xExch456789012345abcdef0123456789abcdef01",
};

const DEMO_TRANSACTIONS = [
  {
    id: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    type: "out",
    amount: "15.5",
    currency: "ETH",
    to: "0x742d35...6C87",
    timestamp: "2024-01-15 14:30:22",
    status: "confirmed",
    risk: "low",
    gasUsed: "21000",
    gasPrice: "25.5",
    blockNumber: "18950123",
    category: "transfer",
  },
  {
    id: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    type: "in",
    amount: "0.25",
    currency: "ETH",
    from: "0x123abc...def9",
    timestamp: "2024-01-15 12:15:10",
    status: "confirmed",
    risk: "medium",
    gasUsed: "65000",
    gasPrice: "30.2",
    blockNumber: "18950089",
    category: "contract_interaction",
  },
  {
    id: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    type: "out",
    amount: "100.0",
    currency: "USDT",
    to: "0xScam123...345",
    timestamp: "2024-01-15 09:45:33",
    status: "confirmed",
    risk: "high",
    gasUsed: "45000",
    gasPrice: "35.8",
    blockNumber: "18950045",
    category: "token_transfer",
  },
];

const DEMO_RISK_FACTORS = [
  {
    factor: "Scam Database Match",
    severity: "critical",
    description: "Address found in CryptoScamDB with 47 reported incidents",
    confidence: 95,
    sources: ["CryptoScamDB", "ChainAbuse", "Etherscan Labels"],
  },
  {
    factor: "Bulk Transfer Pattern",
    severity: "high",
    description:
      "23 transactions in 4 minutes detected - possible automated distribution",
    confidence: 87,
    sources: ["Pattern Analysis", "Transaction Timing"],
  },
  {
    factor: "Large Value Transfer",
    severity: "medium",
    description: "Single transaction >$50,000 to new address",
    confidence: 72,
    sources: ["Value Analysis", "Address Age Check"],
  },
  {
    factor: "MEV Bot Activity",
    severity: "low",
    description: "Consistent front-running patterns detected",
    confidence: 65,
    sources: ["MEV Detection", "Gas Price Analysis"],
  },
];

function App() {
  const [searchAddress, setSearchAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [addressType, setAddressType] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState("overview");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [networkView, setNetworkView] = useState("2d");

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 8]);

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisProgress(0);
    setCurrentStep(0);

    // Enhanced analysis simulation with realistic timing
    for (let i = 0; i < 10; i++) {
      setCurrentStep(i);
      setAnalysisProgress((i + 1) * (100 / 10));
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 800)
      );
    }

    // Determine address type and risk based on input
    if (searchAddress.toLowerCase().includes("scam")) {
      setAddressType("wallet");
      setRiskScore(92);
    } else if (
      searchAddress.toLowerCase().includes("contract") ||
      searchAddress.includes("A0b86a")
    ) {
      setAddressType("contract");
      setRiskScore(28);
    } else if (searchAddress.toLowerCase().includes("defi")) {
      setAddressType("contract");
      setRiskScore(15);
    } else if (searchAddress.toLowerCase().includes("exch")) {
      setAddressType("wallet");
      setRiskScore(8);
    } else {
      setAddressType("wallet");
      setRiskScore(45);
    }

    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setActivePanel("overview");
  };

  const getRiskLevel = (score) => {
    if (score >= 80)
      return {
        level: "Critical",
        color: "text-red-700 bg-red-50 border-red-200",
        bgColor: "bg-red-50 border-red-200",
        glowColor: "shadow-glow-red",
      };
    if (score >= 60)
      return {
        level: "High",
        color: "text-red-600 bg-red-50 border-red-200",
        bgColor: "bg-red-50 border-red-200",
        glowColor: "shadow-glow-red",
      };
    if (score >= 40)
      return {
        level: "Medium",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        bgColor: "bg-yellow-50 border-yellow-200",
        glowColor: "shadow-glow",
      };
    return {
      level: "Low",
      color: "text-green-600 bg-green-50 border-green-200",
      bgColor: "bg-green-50 border-green-200",
      glowColor: "shadow-glow-green",
    };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={containerRef}>
          <div className="p-8 space-y-8">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight"
                >
                  Advanced Blockchain Investigation
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                  Leverage cutting-edge AI and machine learning to analyze
                  blockchain addresses, detect sophisticated threats, and
                  generate comprehensive investigation reports
                </motion.p>
              </div>

              {/* Enhanced Search Interface */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative glass rounded-2xl p-3 border-2 border-white/30 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-md">
                      {/* Search Icon */}
                      <div className="pl-2 sm:pl-4">
                        <Search className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                      </div>

                      {/* Input Field */}
                      <Input
                        placeholder="Enter blockchain address (0x...) or ENS domain"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        className="w-full sm:flex-1 h-14 sm:h-16 px-4 sm:px-6 text-base sm:text-lg font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-muted-foreground/60 focus:placeholder:text-muted-foreground/80 transition-all duration-200"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />

                      {/* Button */}
                      <Button
                        onClick={handleSearch}
                        disabled={isAnalyzing || !searchAddress.trim()}
                        className="w-full sm:w-auto h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-2 border-white rounded-full animate-spin mr-3" />
                            Investigating...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Investigate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Examples */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8"
                >
                  <div className="flex flex-wrap justify-center gap-3 items-center">
                    <span className="text-sm text-muted-foreground font-medium mb-2">
                      Try these examples:
                    </span>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.entries(DEMO_ADDRESSES).map(
                        ([type, address], index) => (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSearchAddress(address)}
                              className="text-xs font-mono hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 rounded-lg"
                            >
                              <span className="capitalize font-sans mr-2 text-primary">
                                {type}:
                              </span>
                              {address.slice(0, 12)}...
                            </Button>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Analysis Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="glass border-primary/20 shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                          <Radar className="w-12 h-12 text-white animate-spin" />
                        </div>
                        <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Deep Analysis in Progress
                        </h3>
                        <p className="text-muted-foreground text-lg">
                          Analyzing blockchain data across multiple networks and
                          threat intelligence sources
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xl">
                            Overall Progress
                          </span>
                          <span className="text-3xl font-bold text-primary">
                            {analysisProgress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="relative">
                          <Progress
                            value={analysisProgress}
                            className="h-4 bg-muted/30 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 rounded-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-sm" />
                        </div>

                        {/* Analysis Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                          {[
                            {
                              label: "Blockchain Analysis",
                              icon: Activity,
                              completed: analysisProgress > 33,
                            },
                            {
                              label: "Risk Assessment",
                              icon: Shield,
                              completed: analysisProgress > 66,
                            },
                            {
                              label: "Report Generation",
                              icon: FileText,
                              completed: analysisProgress > 90,
                            },
                          ].map((step, index) => (
                            <div
                              key={step.label}
                              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                                step.completed
                                  ? "bg-green-50 text-green-700"
                                  : "bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              <step.icon
                                className={`w-5 h-5 ${
                                  step.completed ? "text-green-600" : ""
                                }`}
                              />
                              <span className="font-medium">{step.label}</span>
                              {step.completed && (
                                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
                >
                  {/* Risk Overview Dashboard */}
                  <section className="space-y-6 mt-20">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Investigation Overview
                      </h2>
                      <p className="text-muted-foreground">
                        Comprehensive analysis results for the investigated
                        address
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Risk Score Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card
                          className={`${risk.bgColor} border-2 hover-lift ${risk.glowColor} transition-all duration-500 group relative overflow-hidden h-80`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="pb-4 relative z-10">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl flex items-center">
                                <Gauge className="w-6 h-6 mr-3" />
                                Risk Assessment
                              </CardTitle>
                              <div className="relative">
                                {riskScore >= 80 ? (
                                  <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
                                ) : riskScore >= 60 ? (
                                  <XCircle className="w-8 h-8 text-red-500" />
                                ) : riskScore >= 40 ? (
                                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                ) : (
                                  <CheckCircle className="w-8 h-8 text-green-500" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="relative z-10">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <span className="text-4xl font-bold">
                                  {riskScore}/100
                                </span>
                                <Badge
                                  className={`${risk.color} text-sm px-3 py-1`}
                                  variant="outline"
                                >
                                  {risk.level} Risk
                                </Badge>
                              </div>
                              <div className="relative">
                                <Progress value={riskScore} className="h-4" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-4 rounded-full animate-pulse" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Address Type Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <Card className="hover-lift transition-all duration-500 group border-2 hover:border-primary/30 relative overflow-hidden h-80">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="pb-4 relative z-10">
                            <CardTitle className="text-xl flex items-center">
                              {addressType === "contract" ? (
                                <Building2 className="w-6 h-6 mr-3 text-purple-500" />
                              ) : (
                                <Wallet className="w-6 h-6 mr-3 text-blue-500" />
                              )}
                              Address Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 relative z-10">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  addressType === "contract"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {addressType === "contract" ? (
                                  <Lock className="w-6 h-6" />
                                ) : (
                                  <Users className="w-6 h-6" />
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-xl capitalize">
                                  {addressType}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {addressType === "contract"
                                    ? "Smart Contract"
                                    : "Externally Owned Account"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Address
                                </p>
                                <p className="font-mono text-sm break-all">
                                  {searchAddress}
                                </p>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-background"
                                  >
                                    {addressType === "contract"
                                      ? "Smart Contract"
                                      : "EOA Wallet"}
                                  </Badge>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Copy Address
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Activity Stats Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Card className="h-80 hover-lift transition-all duration-500 group border-2 hover:border-green-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className=" relative z-10">
                            <CardTitle className="text-xl flex items-center">
                              <Activity className="w-6 h-6 mr-3 text-green-500" />
                              Activity Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className=" relative z-10">
                            {[
                              {
                                label: "Total Transactions",
                                value: "1,247",
                                icon: ArrowUpDown,
                                color: "text-blue-600",
                              },
                              {
                                label: "Total Value",
                                value: "$45,230",
                                icon: DollarSign,
                                color: "text-green-600",
                              },
                              {
                                label: "First Activity",
                                value: "Jan 2024",
                                icon: Calendar,
                                color: "text-purple-600",
                              },
                              {
                                label: "Last Activity",
                                value: "2 hours ago",
                                icon: Clock,
                                color: "text-orange-600",
                              },
                            ].map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <stat.icon
                                    className={`w-5 h-5 ${stat.color}`}
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {stat.label}
                                  </span>
                                </div>
                                <span
                                  className={`font-bold text-lg ${stat.color}`}
                                >
                                  {stat.value}
                                </span>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </section>

                  {/* Address Summary Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-6 mt-20"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Detailed Analysis
                      </h2>
                      <p className="text-muted-foreground">
                        In-depth breakdown of address characteristics and
                        behavior
                      </p>
                    </div>

                    <Card className="hover-lift transition-all duration-500 shadow-xl border-2 hover:border-blue-300">
                      <CardHeader className="border-b bg-gradient-to-r from-blue-200 to-indigo-100">
                        <div className="flex items-center justify-between mt-6">
                          <CardTitle className="text-2xl flex items-center">
                            <Target className="w-6 h-6 mr-3 text-blue-500" />
                            Address Summary
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Report
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-green-50"
                            >
                              <Bookmark className="w-4 h-4 mr-2" />
                              Save Analysis
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-purple-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Balance Information */}
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center">
                              <Wallet className="w-5 h-5 mr-2 text-green-500" />
                              Balance & Holdings
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                {
                                  label: "ETH Balance",
                                  value: "15.47 ETH",
                                  subValue: "$44,051.23",
                                  color: "bg-blue-50 border-blue-200",
                                },
                                {
                                  label: "Token Count",
                                  value: "12",
                                  subValue: "Different tokens",
                                  color: "bg-purple-50 border-purple-200",
                                },
                                {
                                  label: "NFT Count",
                                  value: "8",
                                  subValue: "Unique items",
                                  color: "bg-pink-50 border-pink-200",
                                },
                                {
                                  label: "Total USD",
                                  value: "$45.2K",
                                  subValue: "Est. value",
                                  color: "bg-green-50 border-green-200",
                                },
                              ].map((item, index) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                  }}
                                  className={`p-4 rounded-xl border-2 ${item.color} hover:scale-105 transition-all duration-200`}
                                >
                                  <p className="text-2xl font-bold text-gray-900">
                                    {item.value}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.subValue}
                                  </p>
                                </motion.div>
                              ))}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              {[
                                {
                                  label: "Account Age",
                                  value: "247 days",
                                  icon: Calendar,
                                },
                                {
                                  label: "First Transaction",
                                  value: "Jan 15, 2024",
                                  icon: Clock,
                                },
                                {
                                  label: "Network",
                                  value: "Ethereum Mainnet",
                                  icon: Globe,
                                },
                              ].map((detail, index) => (
                                <div
                                  key={detail.label}
                                  className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors duration-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <detail.icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {detail.label}
                                    </span>
                                  </div>
                                  <span className="font-mono font-medium">
                                    {detail.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Transaction Analytics */}
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center">
                              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                              Transaction Analytics
                            </h3>

                            <div className="space-y-4">
                              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    Transaction Volume
                                  </span>
                                  <span className="text-2xl font-bold text-blue-600">
                                    1,247
                                  </span>
                                </div>
                                <Progress
                                  value={85}
                                  className="h-2 bg-blue-100 [&>div]:bg-blue-600"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Above average activity
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-muted-foreground">
                                    Incoming
                                  </p>
                                  <p className="text-xl font-bold text-green-600">
                                    847
                                  </p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-sm text-muted-foreground">
                                    Outgoing
                                  </p>
                                  <p className="text-xl font-bold text-red-600">
                                    400
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Avg. Transaction Value
                                  </span>
                                  <span className="font-bold">$36.27</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Max Transaction
                                  </span>
                                  <span className="font-bold text-green-600">
                                    $2,340.15
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Gas Spent (Total)
                                  </span>
                                  <span className="font-bold">0.47 ETH</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Active Days
                                  </span>
                                  <span className="font-bold">89/247</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.section>

                  {/* Transaction History Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Transaction History
                      </h2>
                      <p className="text-muted-foreground">
                        Recent transaction activity with risk assessment
                      </p>
                    </div>

                    <Card className="hover-lift transition-all duration-500 shadow-xl border-2">
                      <CardHeader className="border-b bg-gradient-to-r from-green-200 to-green-100">
                        <div className="flex items-center justify-between mt-6">
                          <CardTitle className="text-2xl flex items-center">
                            <Activity className="w-6 h-6 mr-3 text-green-500" />
                            Recent Transactions
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {DEMO_TRANSACTIONS.map((tx, index) => (
                            <motion.div
                              key={tx.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`group p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                selectedTransaction === tx.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-muted hover:border-muted-foreground/30 hover:bg-muted/20"
                              }`}
                              onClick={() =>
                                setSelectedTransaction(
                                  selectedTransaction === tx.id ? null : tx.id
                                )
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                                      tx.type === "in"
                                        ? "bg-green-100 text-green-600 group-hover:bg-green-200"
                                        : "bg-red-100 text-red-600 group-hover:bg-red-200"
                                    }`}
                                  >
                                    {tx.type === "in" ? (
                                      <ArrowDownRight className="w-7 h-7" />
                                    ) : (
                                      <ArrowUpRight className="w-7 h-7" />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-mono text-sm font-medium text-gray-900">
                                      {tx.id.slice(0, 32)}...
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {tx.timestamp}
                                      </span>
                                      <span className="flex items-center">
                                        <Layers className="w-3 h-3 mr-1" />
                                        Block {tx.blockNumber}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right space-y-2">
                                  <p
                                    className={`font-bold text-xl ${
                                      tx.type === "in"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {tx.type === "in" ? "+" : "-"}
                                    {tx.amount} {tx.currency}
                                  </p>
                                  <div className="flex items-center space-x-2 justify-end">
                                    <Badge
                                      variant="outline"
                                      className={`font-medium ${
                                        tx.risk === "high"
                                          ? "border-red-300 text-red-700 bg-red-50"
                                          : tx.risk === "medium"
                                          ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                          : "border-green-300 text-green-700 bg-green-50"
                                      }`}
                                    >
                                      {tx.risk} risk
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-muted"
                                    >
                                      {tx.category.replace("_", " ")}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {selectedTransaction === tx.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-muted"
                                  >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      {[
                                        {
                                          label: "Block Number",
                                          value: tx.blockNumber,
                                          icon: Layers,
                                        },
                                        {
                                          label: "Gas Used",
                                          value: tx.gasUsed,
                                          icon: Fuel,
                                        },
                                        {
                                          label: "Gas Price",
                                          value: `${tx.gasPrice} gwei`,
                                          icon: Zap,
                                        },
                                        {
                                          label: "Status",
                                          value: tx.status,
                                          icon: CheckCircle,
                                          isStatus: true,
                                        },
                                      ].map((detail, idx) => (
                                        <div
                                          key={detail.label}
                                          className="space-y-2"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <detail.icon className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground font-medium">
                                              {detail.label}
                                            </p>
                                          </div>
                                          {detail.isStatus ? (
                                            <Badge
                                              variant="outline"
                                              className="text-green-600 border-green-200 bg-green-50"
                                            >
                                              {detail.value}
                                            </Badge>
                                          ) : (
                                            <p className="font-mono font-medium text-gray-900">
                                              {detail.value}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-muted">
                                      <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          View on Etherscan
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Copy className="w-4 h-4 mr-2" />
                                          Copy Hash
                                        </Button>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center mt-8">
                          <Button
                            variant="outline"
                            className="hover:bg-primary/5"
                          >
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Load More Transactions
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.section>

                  {/* Risk Analysis Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                        Risk Factor Analysis
                      </h2>
                      <p className="text-muted-foreground">
                        Detailed breakdown of identified security concerns and
                        suspicious activities
                      </p>
                    </div>

                    <Card className="hover-lift transition-all duration-500 shadow-xl border-2 border-red-100">
                      <CardHeader className="border-b bg-gradient-to-r from-red-200 to-red-100">
                        <div className="flex items-center justify-between mt-8">
                          <CardTitle className="text-2xl flex items-center">
                            <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                            Security Assessment
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8">
                        <div className="space-y-6">
                          {DEMO_RISK_FACTORS.map((factor, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group p-6 rounded-xl border-2 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                            >
                              <div className="flex items-start space-x-6">
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                    factor.severity === "critical"
                                      ? "bg-red-100 text-red-700 group-hover:bg-red-200"
                                      : factor.severity === "high"
                                      ? "bg-red-100 text-red-600 group-hover:bg-red-150"
                                      : factor.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-150"
                                      : "bg-green-100 text-green-600 group-hover:bg-green-150"
                                  }`}
                                >
                                  {factor.severity === "critical" ? (
                                    <AlertOctagon className="w-8 h-8" />
                                  ) : factor.severity === "high" ? (
                                    <XCircle className="w-8 h-8" />
                                  ) : factor.severity === "medium" ? (
                                    <AlertTriangle className="w-8 h-8" />
                                  ) : (
                                    <CheckCircle className="w-8 h-8" />
                                  )}
                                </div>

                                <div className="flex-1 space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                      <h4 className="font-bold text-xl text-gray-900">
                                        {factor.factor}
                                      </h4>
                                      <p className="text-muted-foreground leading-relaxed">
                                        {factor.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                      <Badge
                                        variant="outline"
                                        className={`text-sm px-3 py-1 font-medium ${
                                          factor.severity === "critical"
                                            ? "border-red-400 text-red-800 bg-red-100"
                                            : factor.severity === "high"
                                            ? "border-red-300 text-red-700 bg-red-50"
                                            : factor.severity === "medium"
                                            ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                            : "border-green-300 text-green-700 bg-green-50"
                                        }`}
                                      >
                                        {factor.severity.toUpperCase()} SEVERITY
                                      </Badge>
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {factor.confidence}% Confidence
                                        </Badge>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                              >
                                                <Info className="w-3 h-3" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              More details about this risk
                                              factor
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-4 border-t border-muted">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        Detection Sources:
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        {factor.sources.map((source, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-xs bg-background"
                                          >
                                            {source}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-primary hover:bg-primary/10"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Investigate
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Risk Summary */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-red-900">
                                Overall Risk Assessment
                              </h3>
                              <p className="text-red-700">
                                This address shows multiple high-risk indicators
                                requiring immediate attention
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-red-600">
                                {riskScore}%
                              </p>
                              <p className="text-sm text-red-600 font-medium">
                                Risk Score
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-6">
                            {[
                              {
                                label: "Critical Issues",
                                count: DEMO_RISK_FACTORS.filter(
                                  (f) => f.severity === "critical"
                                ).length,
                                color: "text-red-700",
                              },
                              {
                                label: "High Risk Factors",
                                count: DEMO_RISK_FACTORS.filter(
                                  (f) => f.severity === "high"
                                ).length,
                                color: "text-red-600",
                              },
                              {
                                label: "Medium Concerns",
                                count: DEMO_RISK_FACTORS.filter(
                                  (f) => f.severity === "medium"
                                ).length,
                                color: "text-yellow-600",
                              },
                            ].map((stat, index) => (
                              <div
                                key={stat.label}
                                className="text-center p-3 bg-white/50 rounded-lg"
                              >
                                <p
                                  className={`text-2xl font-bold ${stat.color}`}
                                >
                                  {stat.count}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {stat.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default App;
