"use client";
import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  Zap,
  Activity,
  Building2,
  Wallet,
  Lock,
  Users,
  Copy,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Globe,
  BarChart3,
  DollarSign,
  ArrowUpDown,
  FileText,
  Radar,
  Shield,
  Fuel,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  Share2,
  Bookmark,
  Download,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { walletAPI } from "@/lib/api";
import { format, startOfMonth, endOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [searchAddress, setSearchAddress] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [addressType, setAddressType] = useState(null);
  const [activePanel, setActivePanel] = useState("overview");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [realTransactions, setRealTransactions] = useState([]);
  const [analysisError, setAnalysisError] = useState(null);
  const [realActivityStats, setRealActivityStats] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfDay(new Date()),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const containerRef = useRef(null);

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      setAddressError("Please enter a blockchain address");
      return;
    }    

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisProgress(0);
    setCurrentStep(0);
    setAnalysisError(null);
    setRealTransactions([]);
    setRealActivityStats(null);
    setAddressType(null);
    setCursor(null);
    setAddressError(null);

    try {
      const analysisSteps = [
        { label: "Validating Address...", duration: 800 },
        { label: "Fetching Transaction History...", duration: 1500 },
        { label: "Analyzing Exchange Patterns...", duration: 1200 },
        { label: "Generating Intelligence Report...", duration: 800 },
      ];

      const formattedRange = {
        timeRange: "custom",
        customStart: format(dateRange.startDate, "yyyy-MM-dd"),
        customEnd: format(dateRange.endDate, "yyyy-MM-dd"),
      };

      const apiPromise = walletAPI.analyzeAddress(searchAddress, formattedRange);

      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        setAnalysisProgress(((i + 1) / analysisSteps.length) * 90);
        await new Promise((resolve) =>
          setTimeout(resolve, analysisSteps[i].duration)
        );
      }

      const apiResponse = await apiPromise;

      // Validate transactions array
      const transactions = Array.isArray(apiResponse.transactions)
        ? apiResponse.transactions
        : [];

      // Process the real data
      const formattedTransactions = transactions.map((tx) =>
        walletAPI.formatTransactionForUI(tx, searchAddress)
      );

      const addressCategory = walletAPI.categorizeAddress(transactions);
      const activityStats = walletAPI.generateActivityStats(transactions);

      setRealTransactions(formattedTransactions);
      setRealActivityStats(activityStats);
      setAddressType(addressCategory);
      setHasMoreData(apiResponse.hasMore || false);
      setCursor(apiResponse.cursor || null);

      setAnalysisProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError(error.message || "Failed to analyze address");
      setRealTransactions([]);
      setRealActivityStats(null);
      setAddressType(null);
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActivePanel("overview");
    }
  };

  const handleLoadMoreTransactions = async () => {
    if (!hasMoreData || loadingMore || !cursor) return;

    setLoadingMore(true);
    try {
      const formattedRange = {
        timeRange: "custom",
        customStart: format(dateRange.startDate, "yyyy-MM-dd"),
        customEnd: format(dateRange.endDate, "yyyy-MM-dd"),
      };

      console.log("Loading more with cursor:", cursor); // Debug log
      const response = await walletAPI.analyzeAddress(searchAddress, formattedRange, {
        cursor,
      });

      console.log("API Response:", response); // Debug log
      const newTransactions = Array.isArray(response.transactions)
        ? response.transactions.map((tx) =>
            walletAPI.formatTransactionForUI(tx, searchAddress)
          )
        : [];

      if (newTransactions.length > 0) {
        setRealTransactions((prev) => {
          // Filter out duplicates based on tx.id
          const uniqueNewTxs = newTransactions.filter(
            (newTx) => !prev.some((prevTx) => prevTx.id === newTx.id)
          );
          return [...prev, ...uniqueNewTxs];
        });
        setHasMoreData(response.hasMore || false);
        setCursor(response.cursor || null);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Failed to load more transactions:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
                        onChange={(e) => {
                          setSearchAddress(e.target.value);
                          setAddressError(null);
                        }}
                        className={`w-full sm:flex-1 h-14 sm:h-16 px-4 sm:px-6 text-base sm:text-lg font-mono bg-zinc-50 dark:bg-zinc-800 border ${
                          addressError ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-muted-foreground/60 focus:placeholder:text-muted-foreground/80 transition-all duration-200`}
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
                    {/* Address Error */}
                    {addressError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {addressError}
                      </motion.p>
                    )}
                    {/* Date Range Picker */}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-6"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        {format(dateRange.startDate, "MMM d, yyyy")} -{" "}
                        {format(dateRange.endDate, "MMM d, yyyy")}
                      </Button>
                      {showDatePicker && (
                        <div className="absolute z-10 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4">
                          <div className="flex flex-col gap-4">
                            <DatePicker
                              selected={dateRange.startDate}
                              onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                              selectsStart
                              startDate={dateRange.startDate}
                              endDate={dateRange.endDate}
                              maxDate={dateRange.endDate}
                              placeholderText="Start Date"
                              className="border p-2 rounded w-full"
                            />
                            <DatePicker
                              selected={dateRange.endDate}
                              onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                              selectsEnd
                              startDate={dateRange.startDate}
                              endDate={dateRange.endDate}
                              minDate={dateRange.startDate}
                              maxDate={new Date()}
                              placeholderText="End Date"
                              className="border p-2 rounded w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                              label: "Exchange Analysis",
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

            {/* Analysis Error */}
            <AnimatePresence>
              {analysisError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                          <h3 className="font-semibold text-red-900">
                            Analysis Failed
                          </h3>
                          <p className="text-red-700">{analysisError}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisComplete && !analysisError && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
                >
                  {/* Overview Section */}
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                  {addressType || "wallet"}
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
                          <CardHeader className="relative z-10">
                            <CardTitle className="text-xl flex items-center">
                              <Activity className="w-6 h-6 mr-3 text-green-500" />
                              Activity Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="relative z-10">
                            {realActivityStats ? (
                              [
                                {
                                  label: "Total Transactions",
                                  value:
                                    realActivityStats.totalTransactions.toLocaleString(),
                                  icon: ArrowUpDown,
                                  color: "text-blue-600",
                                },
                                {
                                  label: "Total Value",
                                  value: `${realActivityStats.totalValue.toFixed(
                                    2
                                  )} ETH`,
                                  icon: DollarSign,
                                  color: "text-green-600",
                                }
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
                              ))
                            ) : (
                              <p className="text-muted-foreground">
                                No activity data available
                              </p>
                            )}
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
                              {realActivityStats ? (
                                [
                                  {
                                    label: "ETH Balance",
                                    value: `${realActivityStats.totalValue.toFixed(
                                      3
                                    )} ETH`,
                                    subValue: `~$${(
                                      realActivityStats.totalValue * 2850
                                    ).toLocaleString()}`,
                                    color: "bg-blue-50 border-blue-200",
                                  },
                                  {
                                    label: "Transaction Count",
                                    value:
                                      realActivityStats.totalTransactions.toString(),
                                    subValue: "Total transactions",
                                    color: "bg-purple-50 border-purple-200",
                                  },
                                  {
                                    label: "Avg. Transaction",
                                    value: `${
                                      realActivityStats.averageValue?.toFixed(4) ||
                                      0
                                    } ETH`,
                                    subValue: "Average value",
                                    color: "bg-pink-50 border-pink-200",
                                  },
                                  {
                                    label: "Gas Spent",
                                    value: `${
                                      realActivityStats.totalGasSpent?.toFixed(3) ||
                                      0
                                    } ETH`,
                                    subValue: "Total gas fees",
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
                                ))
                              ) : (
                                <p className="text-muted-foreground col-span-2">
                                  No balance data available
                                </p>
                              )}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              {realActivityStats ? (
                                [
                  
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
                                ))
                              ) : (
                                <p className="text-muted-foreground">
                                  No activity details available
                                </p>
                              )}
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
                                    {realActivityStats?.totalTransactions.toLocaleString() ||
                                      "0"}
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min(
                                    (realActivityStats?.totalTransactions || 0) /
                                      20,
                                    100
                                  )}
                                  className="h-2 bg-blue-100 [&>div]:bg-blue-600"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  {realActivityStats?.totalTransactions > 1000
                                    ? "Very active"
                                    : realActivityStats?.totalTransactions > 0
                                    ? "Active"
                                    : "No activity"}{" "}
                                  address
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-muted-foreground">
                                    Incoming
                                  </p>
                                  <p className="text-xl font-bold text-green-600">
                                    {realActivityStats?.incomingTxs || "0"}
                                  </p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-sm text-muted-foreground">
                                    Outgoing
                                  </p>
                                  <p className="text-xl font-bold text-red-600">
                                    {realActivityStats?.outgoingTxs || "0"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Avg. Transaction Value
                                  </span>
                                  <span className="font-bold">
                                    {realActivityStats?.averageValue?.toFixed(4) ||
                                      "0"}{" "}
                                    ETH
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Max Transaction
                                  </span>
                                  <span className="font-bold text-green-600">
                                    {realActivityStats?.maxValue?.toFixed(4) ||
                                      "0"}{" "}
                                    ETH
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Gas Spent (Total)
                                  </span>
                                  <span className="font-bold">
                                    {realActivityStats?.totalGasSpent?.toFixed(3) ||
                                      "0"}{" "}
                                    ETH
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Active Days
                                  </span>
                                  <span className="font-bold">
                                    {realActivityStats?.activeDays || "0"}/365
                                  </span>
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
                        Recent transaction activity with exchange details
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
                          {realTransactions.length > 0 ? (
                            realTransactions.map((tx, index) => (
                              <motion.div
                                key={`${tx.id}-${index}`} // Use index as fallback for unique key
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
                                        Txn_id: {tx.id
                                          ? tx.id.slice(0, 32)
                                          : `Unknown-${index}`}
                                        ...
                                      </p>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {tx.timestamp || "N/A"}
                                        </span>
                                        <span className="flex items-center">
                                          <Layers className="w-3 h-3 mr-1" />
                                          Block {tx.blockNumber || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-4 text-xl text-muted-foreground">
                                        <span>
                                          From: {tx.from_label || "Unknown"} ({tx.from_type})
                                        </span>
                                        <span>
                                          To: {tx.to_label || "Unknown"} ({tx.to_type})
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
                                      {tx.amount || "0"} {tx.currency || "N/A"}
                                    </p>
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
                                            value: tx.blockNumber || "N/A",
                                            icon: Layers,
                                          },
                                          {
                                            label: "Gas Used",
                                            value: tx.gasUsed || "0",
                                            icon: Fuel,
                                          },
                                          {
                                            label: "Gas Price",
                                            value: tx.gasPrice
                                              ? `${tx.gasPrice} gwei`
                                              : "N/A",
                                            icon: Zap,
                                          },
                                          {
                                            label: "Status",
                                            value: tx.status || "Unknown",
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
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                          >
                                            <a
                                              href={`https://etherscan.io/tx/${tx.id}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <ExternalLink className="w-4 h-4 mr-2" />
                                              View on Etherscan
                                            </a>
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
                            ))
                          ) : (
                            <p className="text-muted-foreground text-center">
                              No transactions available
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-center mt-8">
                          <Button
                            variant="outline"
                            className="hover:bg-primary/5"
                            onClick={handleLoadMoreTransactions}
                            disabled={!hasMoreData || loadingMore}
                          >
                            {loadingMore ? (
                              <>
                                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-2 border-muted-foreground rounded-full animate-spin mr-2" />
                                Loading...
                              </>
                            ) : hasMoreData ? (
                              <>
                                <ChevronDown className="w-4 h-4 mr-2" />
                                Load More Transactions
                              </>
                            ) : (
                              "No more transactions"
                            )}
                          </Button>
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