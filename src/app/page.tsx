"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


interface Make {
    MakeId: number;
    MakeName: string;
}

export default function Home() {
    const [makes, setMakes] = useState<Make[]>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2014}, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const response = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
                setMakes(response.data.Results);
            } catch (error) {
                console.error('Error fetching makes:', error);
            }
        };
        fetchMakes();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Car Dealer App</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                        <Select onValueChange={setSelectedMake}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a make" />
                            </SelectTrigger>
                            <SelectContent>
                                {makes.map((make) => (
                                    <SelectItem key={make.MakeId} value={make.MakeId.toString()}>
                                        {make.MakeName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Link href={`/result/${selectedMake}/${selectedYear}`} passHref>
                            <Button
                                disabled={!selectedMake || !selectedYear}
                                className="w-full"
                            >
                                Next
                            </Button>
                        </Link>
                </CardContent>
            </Card>
        </div>
    );
}