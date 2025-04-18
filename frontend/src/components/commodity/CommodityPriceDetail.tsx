import React, { useState } from "react";
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { type CommodityPrice } from "@/lib/data/types";
import { 
  LineChart as LineChartIcon, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Map, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  Percent, 
  CalendarDays, 
  Truck, 
  Store, 
  Bookmark 
} from "lucide-react";

interface PriceHistoryPoint {
  date: string;
  price: number;
}

interface RegionalComparison {
  region: string;
  price: number;
}

interface CommodityPriceDetailProps {
  commodity: CommodityPrice;
  priceHistory: PriceHistoryPoint[];
  regionalComparison: RegionalComparison[];
}

export const CommodityPriceDetail: React.FC<CommodityPriceDetailProps> = ({
  commodity,
  priceHistory,
  regionalComparison
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Generate forecast data (simple linear projection for demo)
  const generateForecastData = () => {
    if (priceHistory.length < 2) return [];
    
    const lastPrice = priceHistory[priceHistory.length - 1].price;
    const avgChangePerMonth = commodity.predictedChange / 100 * lastPrice;
    
    return [
      { date: "Des 2023", price: lastPrice + avgChangePerMonth, type: "forecast" },
      { date: "Jan 2024", price: lastPrice + 2 * avgChangePerMonth, type: "forecast" },
      { date: "Feb 2024", price: lastPrice + 3 * avgChangePerMonth, type: "forecast" }
    ];
  };
  
  // Calculate price statistics
  const calculateStats = () => {
    if (!priceHistory.length) return { min: 0, max: 0, avg: 0, volatility: 0 };
    
    const prices = priceHistory.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Calculate volatility (standard deviation / mean)
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / avg * 100;
    
    return { min, max, avg, volatility };
  };
  
  const stats = calculateStats();
  const forecastData = generateForecastData();
  const combinedChartData = [...priceHistory, ...forecastData];
  
  // Format the trend direction and percentage
  const trendDirection = commodity.predictedChange >= 0 ? "naik" : "turun";
  const trendPercentage = Math.abs(commodity.predictedChange).toFixed(1);
  
  // Calculate price change from previous month
  const currentPrice = commodity.price;
  const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-earth-dark-green flex items-center gap-2">
          {commodity.name}
          <Badge 
            className={`${
              commodity.predictedChange >= 0 
                ? 'bg-earth-pale-green text-earth-dark-green border border-earth-medium-green/30' 
                : 'bg-earth-light-brown text-earth-brown border border-earth-brown/30'
            }`}
          >
            {trendDirection} {trendPercentage}%
          </Badge>
        </h2>
        <div className="flex items-center mt-1 text-earth-medium-green">
          <Map className="h-4 w-4 mr-1" />
          <span>{commodity.region}</span>
          {commodity.grade && (
            <>
              <span className="mx-2">•</span>
              <span>Grade {commodity.grade}</span>
            </>
          )}
          <span className="mx-2">•</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>Update: {new Date(commodity.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-earth-pale-green to-white border-earth-medium-green/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-earth-dark-green">Harga Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-earth-dark-green">{formatCurrency(commodity.price)}/{commodity.unit}</div>
            <div className={`flex items-center mt-2 ${priceChange >= 0 ? 'text-earth-dark-green' : 'text-earth-brown'}`}>
              {priceChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span>{formatCurrency(Math.abs(priceChange))}</span>
              <span className="ml-1">({Math.abs(priceChangePercent).toFixed(1)}%)</span>
              <span className="ml-1 text-sm text-earth-medium-green">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-earth-light-brown/30 to-white border-earth-medium-green/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-earth-dark-green">Prediksi 3 Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-earth-dark-green">
              {formatCurrency(forecastData.length ? forecastData[forecastData.length - 1].price : commodity.price)}
            </div>
            <div className={`flex items-center mt-2 ${commodity.predictedChange >= 0 ? 'text-earth-dark-green' : 'text-earth-brown'}`}>
              {commodity.predictedChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>Tren {trendDirection}</span>
              <span className="ml-1">({trendPercentage}%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-earth-wheat/30 to-white border-earth-medium-green/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-earth-dark-green">Volatilitas Harga</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-earth-dark-green">{stats.volatility.toFixed(1)}%</div>
            <div className="flex items-center mt-2 text-earth-medium-green">
              <Percent className="h-4 w-4 mr-1" />
              <span>{stats.volatility < 5 ? 'Stabil' : stats.volatility < 10 ? 'Moderat' : 'Tinggi'}</span>
              <span className="ml-1 text-sm">6 bulan terakhir</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-earth-pale-green/50">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white"
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Tren Harga
          </TabsTrigger>
          <TabsTrigger 
            value="regional" 
            className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white"
          >
            <Map className="h-4 w-4 mr-2" />
            Perbandingan Regional
          </TabsTrigger>
          <TabsTrigger 
            value="market" 
            className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white"
          >
            <Info className="h-4 w-4 mr-2" />
            Info Pasar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card className="bg-gradient-to-br from-earth-pale-green/20 to-white border-earth-medium-green/30">
            <CardHeader>
              <CardTitle className="text-xl text-earth-dark-green">Tren Harga 6 Bulan Terakhir & Proyeksi 3 Bulan</CardTitle>
              <CardDescription>
                Data historis dan perkiraan harga untuk {commodity.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={combinedChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Harga']}
                      labelFormatter={(label) => `Periode: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      name="Harga Historis" 
                      stroke="#38A169" 
                      strokeWidth={2}
                      dot={{ stroke: '#38A169', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                    />
                    {/* Fix: Removed duplicate 'dataKey' attribute here and kept the specialized one below */}
                    <Line 
                      type="monotone" 
                      name="Proyeksi Harga" 
                      stroke="#805AD5" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ stroke: '#805AD5', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      dataKey={(entry) => entry.type === 'forecast' ? entry.price : null}
                      isAnimationActive={true}
                    />
                    <ReferenceLine 
                      y={commodity.price} 
                      stroke="#2C7A7B" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: 'Harga Saat Ini', 
                        position: 'insideBottomRight', 
                        fill: '#2C7A7B',
                        fontSize: 12
                      }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Harga Tertinggi</div>
                  <div className="text-lg font-semibold text-earth-dark-green">{formatCurrency(stats.max)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Harga Terendah</div>
                  <div className="text-lg font-semibold text-earth-dark-green">{formatCurrency(stats.min)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Harga Rata-rata</div>
                  <div className="text-lg font-semibold text-earth-dark-green">{formatCurrency(stats.avg)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500">Volatilitas</div>
                  <div className="text-lg font-semibold text-earth-dark-green">{stats.volatility.toFixed(1)}%</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Data harga diperbarui pada {new Date(commodity.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <Button variant="outline" className="sm:w-auto w-full border-earth-medium-green text-earth-dark-green">
                <Bookmark className="h-4 w-4 mr-2" />
                Simpan Data Harga
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="mt-0">
          <Card className="bg-gradient-to-br from-earth-light-brown/20 to-white border-earth-medium-green/30">
            <CardHeader>
              <CardTitle className="text-xl text-earth-dark-green">Perbandingan Harga Antar Wilayah</CardTitle>
              <CardDescription>
                Perbedaan harga {commodity.name} di berbagai wilayah di Indonesia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionalComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis 
                      tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} 
                      domain={['dataMin - 500', 'dataMax + 500']} 
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Harga']}
                      labelFormatter={(label) => `Wilayah: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="price" 
                      name="Harga per Kg" 
                      fill="#38A169" 
                      radius={[4, 4, 0, 0]} 
                      isAnimationActive={true} 
                    />
                    <ReferenceLine 
                      y={commodity.price} 
                      stroke="#2C7A7B" 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: `Harga di ${commodity.region}`, 
                        position: 'insideBottomRight', 
                        fill: '#2C7A7B',
                        fontSize: 12
                      }} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-earth-dark-green mb-2">Analisis Perbedaan Harga Regional</h4>
                <p className="text-gray-600 mb-4">
                  Perbedaan harga antar wilayah dipengaruhi oleh faktor transportasi, ketersediaan pasokan lokal, dan pola konsumsi regional. 
                  Wilayah dengan harga lebih tinggi umumnya memiliki biaya transportasi lebih besar atau pasokan yang lebih terbatas.
                </p>
                
                <div className="bg-earth-pale-green/50 p-4 rounded-md">
                  <h5 className="font-medium text-earth-dark-green mb-1">Rekomendasi untuk Petani:</h5>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Pertimbangkan biaya transportasi ke wilayah dengan harga lebih tinggi</li>
                    <li>Manfaatkan perbedaan harga regional untuk optimasi keuntungan</li>
                    <li>Jalin kemitraan dengan distributor di wilayah dengan harga tinggi</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Data perbandingan regional diperbarui pada {new Date(commodity.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <Button variant="outline" className="sm:w-auto w-full border-earth-medium-green text-earth-dark-green">
                <Bookmark className="h-4 w-4 mr-2" />
                Simpan Perbandingan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="mt-0">
          <Card className="bg-gradient-to-br from-earth-wheat/20 to-white border-earth-medium-green/30">
            <CardHeader>
              <CardTitle className="text-xl text-earth-dark-green">Informasi Pasar {commodity.name}</CardTitle>
              <CardDescription>
                Analisis pasar dan rekomendasi untuk petani dan pembeli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-earth-dark-green mb-3 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-earth-medium-green" />
                    Informasi untuk Petani
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-earth-pale-green/30 p-4 rounded-md">
                      <h5 className="font-medium text-earth-dark-green mb-2">Outlook Pasar</h5>
                      <p className="text-gray-600 mb-2">
                        {commodity.predictedChange >= 0 
                          ? `Harga ${commodity.name} diprediksi akan terus ${trendDirection} dalam 3 bulan ke depan. Ini merupakan momentum yang baik untuk para petani.`
                          : `Harga ${commodity.name} diprediksi akan ${trendDirection} dalam 3 bulan ke depan. Petani disarankan untuk mengamankan kontrak penjualan sekarang.`
                        }
                      </p>
                      <div className={`text-sm font-medium ${commodity.predictedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Proyeksi perubahan: {commodity.predictedChange >= 0 ? '+' : ''}{commodity.predictedChange.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-earth-dark-green mb-2">Rekomendasi Penjualan</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>
                          {commodity.predictedChange >= 0 
                            ? "Simpan produk jika memungkinkan untuk mendapatkan harga yang lebih baik dalam 1-2 bulan kedepan"
                            : "Pertimbangkan untuk menjual produk segera untuk menghindari penurunan harga yang lebih jauh"
                          }
                        </li>
                        <li>
                          {stats.volatility < 8 
                            ? "Volatilitas pasar rendah, harga cenderung stabil dan dapat diprediksi" 
                            : "Volatilitas pasar tinggi, pertimbangkan kontrak harga tetap dengan pembeli"
                          }
                        </li>
                        <li>
                          {regionalComparison.length > 0 && "Pertimbangkan untuk menjual ke wilayah " + 
                            regionalComparison.sort((a, b) => b.price - a.price)[0].region + 
                            " yang memiliki harga tertinggi"
                          }
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-earth-dark-green mb-2">Musim Panen Optimal</h5>
                      <p className="text-gray-600">
                        Berdasarkan tren harga historis, waktu terbaik untuk panen dan jual adalah pada bulan 
                        {stats.max === commodity.price ? " saat ini" : " ketika harga mencapai puncak"}.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-earth-dark-green mb-3 flex items-center">
                    <Store className="h-5 w-5 mr-2 text-earth-medium-green" />
                    Informasi untuk Pembeli
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-earth-pale-green/30 p-4 rounded-md">
                      <h5 className="font-medium text-earth-dark-green mb-2">Outlook Pembelian</h5>
                      <p className="text-gray-600 mb-2">
                        {commodity.predictedChange >= 0 
                          ? `Harga ${commodity.name} diprediksi akan ${trendDirection} dalam beberapa bulan kedepan. Pertimbangkan untuk melakukan pembelian segera atau mengamankan kontrak jangka panjang.`
                          : `Harga ${commodity.name} diprediksi akan ${trendDirection} dalam beberapa bulan kedepan. Anda dapat menunggu untuk mendapatkan harga yang lebih baik, atau melakukan pembelian bertahap.`
                        }
                      </p>
                      <div className={`text-sm font-medium ${commodity.predictedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Proyeksi perubahan: {commodity.predictedChange >= 0 ? '+' : ''}{commodity.predictedChange.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-earth-dark-green mb-2">Rekomendasi Pembelian</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>
                          {commodity.predictedChange >= 0 
                            ? "Pertimbangkan untuk membeli dengan kontrak jangka panjang untuk mengunci harga saat ini"
                            : "Lakukan pembelian bertahap untuk memanfaatkan penurunan harga di masa mendatang"
                          }
                        </li>
                        <li>
                          {regionalComparison.length > 0 && "Pertimbangkan untuk membeli dari wilayah " + 
                            regionalComparison.sort((a, b) => a.price - b.price)[0].region + 
                            " yang memiliki harga terendah"
                          }
                        </li>
                        <li>
                          Periksa ketersediaan stok dan kualitas produk sebelum melakukan pembelian besar
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-earth-dark-green mb-2">Perkiraan Ketersediaan</h5>
                      <p className="text-gray-600">
                        {commodity.name} dengan grade {commodity.grade || "standar"} diperkirakan akan 
                        {commodity.predictedChange >= 0 ? " tersedia dalam jumlah terbatas" : " tersedia dalam jumlah yang cukup"} 
                        dalam 3 bulan ke depan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-2">
              <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="border-earth-medium-green text-earth-dark-green">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Simpan Analisis Pasar
                </Button>
                <Button className="bg-earth-dark-green hover:bg-earth-medium-green text-white">
                  Lihat Produk {commodity.name} di Marketplace
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
