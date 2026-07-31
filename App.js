import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PendoSDK, NavigationLibraryType } from "rn-pendo-sdk";
import {
  Userflow,
  UserflowProvider,
  useUserflowAnchor,
  useUserflowScreen,
  useUserflowScrollContainer,
} from "@userflow/react-native";

const USERFLOW_SERVER_ENDPOINT = "http://localhost:40401";

async function initUserflow() {
  await Userflow.init({
    clientToken: "ct_6grq54rwz5d47bxl3jubyhqhje",
    serverEndpoint: USERFLOW_SERVER_ENDPOINT,
    pairingEndpoint: USERFLOW_SERVER_ENDPOINT,
  });

  await Userflow.identify("test-user-1", {
    name: "Test User",
    email: "test@example.com",
  });
}

void initUserflow();

// Pendo setup
function initPendo() {
  const navigationOptions = { library: NavigationLibraryType.Other };
  const pendoKey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhY2VudGVyIjoidXMiLCJrZXkiOiI2NDdlYTcxNTExNGI4MzdmM2UxM2I0MDQ3NTY4NWEzZmUzNzhiM2JhMWRjNzZiN2ZiODY1ZmQ4NDU0ZDY4NTFlZTIwZDY2ODk5MjI1MzBmZTQ5OGY0NzJmZWVjZGI0YzkzM2FmNzRmYWQzNjBlN2QzODE5ZGFhOGZhNDBlZjI4YzM0MTVjYTE2OWFhYjY0NjAxMDQwNDRkNGJlOWEwNWJlOTdkM2MyM2MxY2VjYmI3MjRiMzU4OGUzMmRhMjlmMDVkMjY4ZmUxM2MxNDVkZWY1ODg3Y2VjZDg0ZGFlZmFkYmJlMzMxMjkwYWI4NWZjNTVjMmY4YjI1MzE4ODU4MjM2MTY4NGRkMjJjMjI4ZjlhZjkzNmQ2YzUwN2MyYjdmNDcuODAzNmYyMjY2MzA5ODMyMGY1ZTYyOGMwOGMxMGI1YTQuMGEzOTJhYjM2N2RkNDFkYWUxNDUwYWVhZTI3NDYyMDgyOGIzNDljMjE0Nzk5ZjdhYzcyYzRmNjEyZGNjMTgyMyJ9.mUsPNilRtIqmBHKJdRouRAIbypHhCSQoebVJ48xIYcTw3K4kdG3ADXra3AdRSAvEiEp0_ySg19Jk3oXf1FAjf4V1U6n_hn3iNz7McH_uVKiceGTru3zfwqnUrReVp0R8UCKM5ihgJ4dTHJ7yyVqg2ZiZE6hZB9MTltSLnv8mjRk";
  PendoSDK.setup(pendoKey, navigationOptions);

  PendoSDK.startSession(
    "test-guy",
    "account-1",
    { name: "someone", email: "something@example.com" },
    {},
  );
}

// initPendo();

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.45,
    change: 2.34,
    changePercent: 1.25,
    volume: "54.2M",
    mktCap: "2.95T",
    high: 191.2,
    low: 186.8,
    pe: 29.4,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 415.2,
    change: -3.1,
    changePercent: -0.74,
    volume: "22.1M",
    mktCap: "3.09T",
    high: 419.5,
    low: 413.0,
    pe: 35.2,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 175.8,
    change: 5.6,
    changePercent: 3.29,
    volume: "18.7M",
    mktCap: "2.18T",
    high: 177.4,
    low: 170.2,
    pe: 25.8,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 198.3,
    change: 1.2,
    changePercent: 0.61,
    volume: "31.4M",
    mktCap: "2.07T",
    high: 200.1,
    low: 196.5,
    pe: 42.1,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 875.5,
    change: -12.3,
    changePercent: -1.39,
    volume: "45.8M",
    mktCap: "2.16T",
    high: 892.0,
    low: 870.2,
    pe: 68.7,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 172.6,
    change: 8.9,
    changePercent: 5.44,
    volume: "89.3M",
    mktCap: "549.8B",
    high: 175.0,
    low: 163.4,
    pe: 47.3,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 512.4,
    change: 7.2,
    changePercent: 1.43,
    volume: "16.2M",
    mktCap: "1.31T",
    high: 515.8,
    low: 504.6,
    pe: 27.9,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    price: 201.8,
    change: -1.5,
    changePercent: -0.74,
    volume: "9.1M",
    mktCap: "581.2B",
    high: 204.3,
    low: 200.5,
    pe: 12.8,
  },
];

const INDICES = [
  { name: "S&P 500", value: "5,234", change: "+0.87%", isUp: true },
  { name: "NASDAQ", value: "16,421", change: "+1.23%", isUp: true },
  { name: "DOW", value: "39,087", change: "-0.12%", isUp: false },
];

const TABS = ["Watchlist", "Gainers", "Losers"];

function MiniChart({ isUp }) {
  const points = isUp
    ? [28, 22, 25, 18, 20, 12, 15, 8, 10, 4]
    : [4, 10, 8, 15, 12, 20, 18, 25, 22, 28];

  const maxP = Math.max(...points);
  const minP = Math.min(...points);
  const normalize = (v) => ((v - minP) / (maxP - minP)) * 30;

  return (
    <View style={styles.chartContainer}>
      {points.map((p, i) => (
        <View
          key={i}
          style={[
            styles.chartBar,
            {
              height: normalize(p) + 4,
              backgroundColor: isUp ? "#16a34a" : "#dc2626",
              opacity: 0.3 + (i / points.length) * 0.7,
            },
          ]}
        />
      ))}
    </View>
  );
}

function StockCard({ stock, onPress }) {
  const isUp = stock.changePercent >= 0;
  return (
    <TouchableOpacity
      style={styles.stockCard}
      onPress={() => onPress(stock)}
      activeOpacity={0.75}
    >
      <View style={styles.stockLeft}>
        <View
          style={[
            styles.symbolBadge,
            { backgroundColor: isUp ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[styles.symbolText, { color: isUp ? "#16a34a" : "#dc2626" }]}
          >
            {stock.symbol.slice(0, 2)}
          </Text>
        </View>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName} numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
      </View>
      <MiniChart isUp={isUp} />
      <View style={styles.stockRight}>
        <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
        <View
          style={[
            styles.changeBadge,
            { backgroundColor: isUp ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[styles.changeText, { color: isUp ? "#16a34a" : "#dc2626" }]}
          >
            {isUp ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function BottomSheet({ visible, onClose, stock }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [tradeType, setTradeType] = useState("Buy");
  const [orderType, setOrderType] = useState("Market");
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 120,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!stock) return null;
  const isUp = stock.changePercent >= 0;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View {...panResponder.panHandlers} style={styles.sheetDragArea}>
          <View style={styles.sheetHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View
              style={[
                styles.sheetSymbolBadge,
                { backgroundColor: isUp ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              <Text
                style={[
                  styles.sheetSymbolChar,
                  { color: isUp ? "#16a34a" : "#dc2626" },
                ]}
              >
                {stock.symbol.slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sheetSymbol}>{stock.symbol}</Text>
              <Text style={styles.sheetName}>{stock.name}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.sheetPrice}>${stock.price.toFixed(2)}</Text>
              <Text
                style={[
                  styles.sheetChange,
                  { color: isUp ? "#16a34a" : "#dc2626" },
                ]}
              >
                {isUp ? "+" : ""}
                {stock.change.toFixed(2)} ({isUp ? "+" : ""}
                {stock.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { label: "Day High", value: `$${stock.high}` },
              { label: "Day Low", value: `$${stock.low}` },
              { label: "Volume", value: stock.volume },
              { label: "Mkt Cap", value: stock.mktCap },
              { label: "P/E Ratio", value: stock.pe },
              { label: "52W Change", value: isUp ? "+24.1%" : "-8.3%" },
            ].map((stat) => (
              <View key={stat.label} style={styles.statBox}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          {/* Trade Type Toggle */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Place Order</Text>
          </View>
          <View style={styles.toggleRow}>
            {["Buy", "Sell"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleBtn,
                  tradeType === t && {
                    backgroundColor: t === "Buy" ? "#16a34a" : "#dc2626",
                  },
                ]}
                onPress={() => setTradeType(t)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    tradeType === t && { color: "#fff" },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Order Type */}
          <View style={styles.orderTypeRow}>
            {["Market", "Limit", "Stop"].map((o) => (
              <TouchableOpacity
                key={o}
                style={[
                  styles.orderTypeBtn,
                  orderType === o && styles.orderTypeActive,
                ]}
                onPress={() => setOrderType(o)}
              >
                <Text
                  style={[
                    styles.orderTypeText,
                    orderType === o && styles.orderTypeTextActive,
                  ]}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity Row */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>10</Text>
              <TouchableOpacity style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Estimated Total</Text>
            <Text style={styles.estimateValue}>
              ${(stock.price * 10).toFixed(2)}
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: tradeType === "Buy" ? "#16a34a" : "#dc2626" },
            ]}
            onPress={() => {
              setConfirmVisible(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>
              {tradeType} {stock.symbol}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>

      {/* Confirm Modal */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmModal}>
            <View
              style={[
                styles.confirmIcon,
                {
                  backgroundColor: tradeType === "Buy" ? "#dcfce7" : "#fee2e2",
                },
              ]}
            >
              <Text style={{ fontSize: 28 }}>
                {tradeType === "Buy" ? "📈" : "📉"}
              </Text>
            </View>
            <Text style={styles.confirmTitle}>Order Placed!</Text>
            <Text style={styles.confirmMsg}>
              {tradeType} order for 10 shares of {stock.symbol} has been
              submitted.
            </Text>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: tradeType === "Buy" ? "#16a34a" : "#dc2626",
                },
              ]}
              onPress={() => {
                setConfirmVisible(false);
                onClose();
              }}
            >
              <Text style={styles.confirmBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  useUserflowScreen(TABS[activeTab]);

  const stockScroll = useUserflowScrollContainer();
  const portfolioAnchor = useUserflowAnchor("portfolio-value");
  const priceAlertsAnchor = useUserflowAnchor("price-alerts");
  const quickTradeAnchor = useUserflowAnchor("quick-trade");

  const filteredStocks = () => {
    if (activeTab === 1)
      return [...STOCKS]
        .filter((s) => s.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent);
    if (activeTab === 2)
      return [...STOCKS]
        .filter((s) => s.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent);
    return STOCKS;
  };

  const openSheet = (stock) => {
    setSelectedStock(stock);
    setSheetVisible(true);
  };

  return (
    <SafeAreaProvider>
      <UserflowProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good afternoon 👋</Text>
              <Text style={styles.headerTitle}>Markets</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                ref={priceAlertsAnchor}
                style={styles.iconBtn}
                onPress={() => setAlertVisible(true)}
              >
                <Text style={styles.iconBtnText}>🔔</Text>
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
            </View>
          </View>

          {/* Portfolio Card */}
          <View ref={portfolioAnchor} style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>$124,830.42</Text>
            <View style={styles.portfolioRow}>
              <View style={styles.portfolioBadge}>
                <Text style={styles.portfolioBadgeText}>
                  +$3,241.20 today +2.67%
                </Text>
              </View>
            </View>
            <View style={styles.portfolioStats}>
              <View style={styles.portfolioStat}>
                <Text style={styles.portfolioStatLabel}>Invested</Text>
                <Text style={styles.portfolioStatValue}>$98,400.00</Text>
              </View>
              <View style={styles.portfolioStatDivider} />
              <View style={styles.portfolioStat}>
                <Text style={styles.portfolioStatLabel}>Returns</Text>
                <Text style={[styles.portfolioStatValue, { color: "#16a34a" }]}>
                  +26.9%
                </Text>
              </View>
              <View style={styles.portfolioStatDivider} />
              <View style={styles.portfolioStat}>
                <Text style={styles.portfolioStatLabel}>Positions</Text>
                <Text style={styles.portfolioStatValue}>8</Text>
              </View>
            </View>
          </View>

          {/* Market Indices */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.indicesScroll}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {INDICES.map((idx) => (
              <View key={idx.name} style={styles.indexCard}>
                <Text style={styles.indexName}>{idx.name}</Text>
                <Text style={styles.indexValue}>{idx.value}</Text>
                <Text
                  style={[
                    styles.indexChange,
                    { color: idx.isUp ? "#16a34a" : "#dc2626" },
                  ]}
                >
                  {idx.change}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {TABS.map((tab, i) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === i && styles.tabActive]}
                onPress={() => setActiveTab(i)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === i && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stock List */}
          <ScrollView
            {...stockScroll}
            style={styles.stockList}
            showsVerticalScrollIndicator={false}
          >
            {filteredStocks().map((stock) => (
              <StockCard key={stock.symbol} stock={stock} onPress={openSheet} />
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* FAB */}
          <TouchableOpacity
            ref={quickTradeAnchor}
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => openSheet(STOCKS[0])}
          >
            <Text style={styles.fabText}>＋ Quick Trade</Text>
          </TouchableOpacity>

          {/* Bottom Sheet */}
          <BottomSheet
            visible={sheetVisible}
            onClose={() => setSheetVisible(false)}
            stock={selectedStock}
          />

          {/* Alert Modal */}
          <Modal
            transparent
            visible={alertVisible}
            animationType="fade"
            onRequestClose={() => setAlertVisible(false)}
          >
            <Pressable
              style={styles.confirmBackdrop}
              onPress={() => setAlertVisible(false)}
            >
              <Pressable style={styles.alertModal} onPress={() => {}}>
                <Text style={styles.alertTitle}>Price Alerts</Text>
                {[
                  {
                    symbol: "AAPL",
                    msg: "Reached your target of $190",
                    time: "2m ago",
                    isUp: true,
                  },
                  {
                    symbol: "NVDA",
                    msg: "Dropped below $880",
                    time: "14m ago",
                    isUp: false,
                  },
                  {
                    symbol: "TSLA",
                    msg: "Volume spike detected",
                    time: "1h ago",
                    isUp: true,
                  },
                ].map((a) => (
                  <View key={a.symbol} style={styles.alertItem}>
                    <View
                      style={[
                        styles.alertDot,
                        { backgroundColor: a.isUp ? "#16a34a" : "#dc2626" },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertSymbol}>{a.symbol}</Text>
                      <Text style={styles.alertMsg}>{a.msg}</Text>
                    </View>
                    <Text style={styles.alertTime}>{a.time}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.alertCloseBtn}
                  onPress={() => setAlertVisible(false)}
                >
                  <Text style={styles.alertCloseBtnText}>Dismiss All</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>
        </SafeAreaView>
      </UserflowProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 2,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconBtnText: { fontSize: 18 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  // Portfolio Card
  portfolioCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  portfolioLabel: { color: "#94a3b8", fontSize: 13, fontWeight: "500" },
  portfolioValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
  },
  portfolioRow: { marginTop: 8 },
  portfolioBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(22,163,74,0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  portfolioBadgeText: { color: "#4ade80", fontSize: 12, fontWeight: "600" },
  portfolioStats: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  portfolioStat: { flex: 1, alignItems: "center" },
  portfolioStatLabel: { color: "#64748b", fontSize: 11, fontWeight: "500" },
  portfolioStatValue: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },
  portfolioStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.08)" },

  // Indices
  indicesScroll: { marginTop: 4 },
  indexCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    minWidth: 110,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  indexName: { fontSize: 11, color: "#64748b", fontWeight: "600" },
  indexValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 3,
  },
  indexChange: { fontSize: 12, fontWeight: "600", marginTop: 2 },

  // Tabs
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 3,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  tabTextActive: { color: "#0f172a" },

  // Stock List
  stockList: { flex: 1, marginTop: 6 },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stockLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  symbolBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: { fontWeight: "800", fontSize: 13 },
  stockInfo: { marginLeft: 10, flex: 1 },
  stockSymbol: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
  stockName: { fontSize: 12, color: "#64748b", marginTop: 2, maxWidth: 90 },
  stockRight: { alignItems: "flex-end" },
  stockPrice: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  changeBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 3,
  },
  changeText: { fontSize: 12, fontWeight: "700" },

  // Mini Chart
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 36,
    marginHorizontal: 10,
    gap: 2,
  },
  chartBar: { width: 4, borderRadius: 2 },

  // FAB
  fab: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    backgroundColor: "#0f172a",
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  fabText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Bottom Sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
  sheetDragArea: { alignItems: "center", paddingTop: 12, paddingBottom: 6 },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e2e8f0",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sheetSymbolBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSymbolChar: { fontWeight: "800", fontSize: 16 },
  sheetSymbol: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  sheetName: { fontSize: 13, color: "#64748b", marginTop: 2 },
  sheetPrice: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  sheetChange: { fontSize: 13, fontWeight: "600", marginTop: 2 },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statBox: { width: "33.33%", paddingHorizontal: 4, marginBottom: 14 },
  statLabel: { fontSize: 11, color: "#64748b", fontWeight: "500" },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 3,
  },

  // Section
  sectionRow: { paddingHorizontal: 20, marginTop: 4, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },

  // Trade Toggles
  toggleRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleText: { fontWeight: "700", fontSize: 14, color: "#64748b" },

  orderTypeRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  orderTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  orderTypeActive: { borderColor: "#0f172a", backgroundColor: "#f8fafc" },
  orderTypeText: { fontSize: 13, fontWeight: "600", color: "#94a3b8" },
  orderTypeTextActive: { color: "#0f172a" },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
  },
  qtyLabel: { fontSize: 14, fontWeight: "600", color: "#0f172a" },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  qtyValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    minWidth: 30,
    textAlign: "center",
  },

  estimateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  estimateLabel: { fontSize: 13, color: "#64748b" },
  estimateValue: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  ctaBtn: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  // Confirm Modal
  confirmBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: SCREEN_WIDTH * 0.82,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  confirmMsg: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Alert Modal
  alertModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: SCREEN_WIDTH * 0.88,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertSymbol: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  alertMsg: { fontSize: 12, color: "#64748b", marginTop: 2 },
  alertTime: { fontSize: 11, color: "#94a3b8", fontWeight: "500" },
  alertCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    alignItems: "center",
  },
  alertCloseBtnText: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
});
