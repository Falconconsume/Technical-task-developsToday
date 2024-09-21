import { Suspense } from 'react';
import axios from 'axios';
import {Card} from "@/components/ui/card";

interface Model {
    Model_ID: number;
    Model_Name: string;
}

async function getModels(makeId: string, year: string): Promise<Model[]> {
    const res = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
    return res.data.Results;
}

async function getMakes(): Promise<{ MakeId: number; MakeName: string }[]> {
    const res = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
    return res.data.Results;
}

export async function generateStaticParams() {
    const makes = await getMakes();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    const paths = makes.flatMap(make =>
        years.map(year => ({
            makeId: make.MakeId.toString(),
            year: year
        }))
    );

    return paths;
}



async function ModelList({ makeId, year }: { makeId: string; year: string }) {
    let models: Model[];
    try {
        models = await getModels(makeId, year);
    } catch (error) {
        return <div className="text-red-500">Failed to fetch models. Please try again.</div>;
    }

    if (models.length === 0) {
        return <div>No models found for this make and year.</div>;
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
                <Card key={model.Model_ID} className="bg-white p-4 rounded shadow">
                    {model.Model_Name}
                </Card>
            ))}
        </ul>
    );
}

export default async function ResultPage({ params }: { params: { makeId: string; year: string } }) {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Models for Make ID {params.makeId} in Year {params.year}</h1>
            <Suspense fallback={<div>Loading models...</div>}>
                <ModelList makeId={params.makeId} year={params.year} />
            </Suspense>
        </div>
    );
}