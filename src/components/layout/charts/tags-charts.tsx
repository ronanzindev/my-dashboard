import { LoadingSpinner } from "@/components/load-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { GetAllTagExpense } from "@/lib/expenses-db"
import { TagsExpense } from "@/types/tags"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import React from "react"
import { toast } from "react-toastify"
import { Label, Pie, PieChart } from "recharts"

interface TagsChartsProps {
    user_email: string
}

const getRandomColor = () => {
    // Lista de cores vibrantes predefinidas
    const colors = [
        'hsl(340, 82%, 52%)',  // Rosa
        'hsl(291, 64%, 42%)',  // Roxo
        'hsl(262, 83%, 58%)',  // Violeta
        'hsl(231, 48%, 48%)',  // Azul
        'hsl(200, 98%, 39%)',  // Azul claro
        'hsl(168, 75%, 43%)',  // Verde água
        'hsl(142, 71%, 45%)',  // Verde
        'hsl(101, 45%, 50%)',  // Verde limão
        'hsl(46, 97%, 48%)',   // Amarelo
        'hsl(23, 100%, 50%)',  // Laranja
        'hsl(4, 90%, 58%)',    // Vermelho
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}
export const TagsCharts = ({ user_email }: TagsChartsProps) => {

    const { data: tagsData, error, isError, isLoading } = useQuery({
        queryKey: ["tagsData", user_email],
        queryFn: () => GetAllTagExpense(user_email),
        select: (data: TagsExpense[]) => {
            return data.map((item) => ({
                tag: item.tag,
                total: item.total,
                fill: getRandomColor()
            }));
        },
    });
    const totalExpense = React.useMemo(() => {
        return tagsData?.reduce((acc, curr) => acc + curr.total, 0)
    }, [])
    const chartConfig = React.useMemo(() => {
        if(!tagsData) return {total: {label: "total"}}
        return tagsData.reduce((config, item) => {
            return {
                ...config,
                [item.tag]: {
                    label: item.tag,
                    color: item.fill
                }
            }
        }, {total: {label: "total"}} as ChartConfig)
    }, [tagsData])
    if (isLoading || !tagsData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }
    if(isError) toast.error(error instanceof Error ? error.message : "Error ao buscar dados das tags")



    return (
        <div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Gastos por categoria</CardTitle>
                    <CardDescription>
                        {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                 data={tagsData}
                                 dataKey="total"  // Alterado: precisamos mostrar o valor total
                                 nameKey="tag"    // Alterado: nome da categoria
                                 outerRadius={80} // Adicionado: define o tamanho do gráfico
                                 innerRadius={60}
                                 strokeWidth={5}
                                 paddingAngle={2} // Adicionado: espaço entre as fatias
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                        {totalExpense?.toLocaleString()}
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                        Total
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        Total de gastos do mês <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Mostrando gastos por categoria
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}