import Image from "next/image"

interface Product {
    id: string
    name: string
    image: string
    price: number
}

const dummyProducts: Product[] = [
    { id: '1', name: 'Drill Machine', image: '/drill.png', price: 122 },
    { id: '2', name: 'Grinder', image: '/grinder.png', price: 98 },
]

export default function ProductGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dummyProducts.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded shadow">
                    <Image width={500} height={500} src={product.image} alt={product.name} className="w-full h-40 object-contain mb-2" />
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">${product.price}</p>
                </div>
            ))}
        </div>
    )
}
