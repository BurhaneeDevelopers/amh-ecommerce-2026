type Category = {
    name: string
    href?: string
    subcategories?: {
        name: string
        href: string
    }[]
}

export const categories: Category[] = [
    {
        name: 'Welding',
        subcategories: [
            { name: 'ARC', href: '/categories/arc' },
            { name: 'MIG', href: '/categories/mig' },
            { name: 'TIC', href: '/categories/tic' },
            { name: 'Plasma', href: '/categories/plasma' },
            { name: 'Welding Accessories', href: '/categories/welding-accessories' }
        ]
    },
    {
        name: 'Agriculture',
        subcategories: [
            { name: 'Chainsaw', href: '/categories/chainsaw' },
            { name: 'Brush Cutter', href: '/categories/brush-cutter' },
            { name: 'Earth Auger', href: '/categories/earth-auger' },
            { name: 'Tiller', href: '/categories/tiller' },
            { name: 'Power Weeder', href: '/categories/power-weeder' },
            { name: 'HTP Pump', href: '/categories/htp-pump' },
            { name: 'Water Pump', href: '/categories/water-pump' },
            { name: 'Agriculture Accessories', href: '/categories/agriculture-accessories' }
        ]
    },
    {
        name: 'Compressors',
        subcategories: [
            { name: 'Oil Free Compressor', href: '/categories/oil-free-compressor' },
            { name: 'Oil Compressor', href: '/categories/oil-compressor' },
            { name: 'Compressor Head', href: '/categories/compressor-head' }
        ]
    },
    {
        name: 'Vaccum Cleaners',
        href: '/categories/vaccum-cleaners'
    },
    {
        name: 'Lifting Equipment',
        subcategories: [
            { name: 'Chain Block', href: '/categories/chain-block' },
            { name: 'Hoist', href: '/categories/hoist' },
            { name: 'Pallet Truck', href: '/categories/pallet-truck' },
            { name: 'Lifting Trolley', href: '/categories/lifting-trolley' }
        ]
    },
    {
        name: 'High Pressure Washer',
        subcategories: [
            { name: 'Do It Yourself', href: '/categories/diy' },
            { name: 'Semi Professional', href: '/categories/semi-professional' },
            { name: 'Professional', href: '/categories/professional' },
            { name: 'Accessories', href: '/categories/accessories' }
        ]
    },
    {
        name: 'Foam Tank',
        href: '/categories/foam-tank'
    },
    {
        name: 'High Pressure Tester',
        href: '/categories/high-pressure-tester'
    },
    {
        name: 'Airless Sprayer',
        subcategories: [
            { name: 'DIY', href: '/categories/diy-sprayer' },
            { name: 'Semi Professional', href: '/categories/semi-professional-sprayer' },
            { name: 'Professional', href: '/categories/professional-sprayer' },
            { name: 'Electric Sprayer', href: '/categories/electric-sprayer' },
            { name: 'Texture Sprayer', href: '/categories/texture-sprayer' }
        ]
    },
    {
        name: 'Putty Sprayers',
        subcategories: [
            { name: 'Paint & Putty', href: '/categories/paint-putty' },
            { name: 'Putty', href: '/categories/putty' }
        ]
    },
    {
        name: 'Construction',
        subcategories: [
            { name: 'Plate Compactor', href: '/categories/plate-compactor' },
            { name: 'Hydraulic Pipe Bender', href: '/categories/hydraulic-pipe-bender' },
            { name: 'Pipe Threading Machine', href: '/categories/pipe-threading-machine' },
            { name: 'Grouting Machine', href: '/categories/grouting-machine' },
            { name: 'Magnetic Drill', href: '/categories/magnetic-drill' },
            { name: 'Tamping Rammer', href: '/categories/tamping-rammer' },
            { name: 'Concrete Ring Saw', href: '/categories/concrete-ring-saw' },
            { name: 'Wall Roughing', href: '/categories/wall-roughing' },
            { name: 'Putty Scraper', href: '/categories/putty-scraper' },
            { name: 'Concrete Chain Saw', href: '/categories/concrete-chain-saw' },
            { name: 'Road Roller', href: '/categories/road-roller' }
        ]
    },
    {
        name: 'Pneumatic Tools',
        subcategories: [
            { name: 'Wrench', href: '/categories/pneumatic-wrench' },
            { name: 'Spay Gun', href: '/categories/spay-gun' },
            { name: 'Ballon Jack', href: '/categories/ballon-jack' },
            { name: 'Sander', href: '/categories/pneumatic-sander' },
            { name: 'Driver and Grinder', href: '/categories/driver-and-grinder' },
            { name: 'Rivertor', href: '/categories/rivertor' },
            { name: 'Brad Nailer', href: '/categories/brad-nailer' },
            { name: 'Other Tools', href: '/categories/pneumatic-other-tools' }
        ]
    },
    {
        name: 'Electric Tools',
        subcategories: [
            { name: 'Grease Bucket', href: '/categories/grease-bucket' },
            { name: 'Demolition Hammer', href: '/categories/demolition-hammer' },
            { name: 'Rotary Hammer', href: '/categories/rotary-hammer' },
            { name: 'Wrench', href: '/categories/electric-wrench' },
            { name: 'Drill Machine', href: '/categories/drill-machine' },
            { name: 'Reciprocating Saw', href: '/categories/reciprocating-saw' },
            { name: 'Grinders', href: '/categories/electric-grinders' },
            { name: 'Blower & Hot Air Gun', href: '/categories/blower-hot-air-gun' },
            { name: 'Marble Cutter', href: '/categories/marble-cutter' },
            { name: 'Other Tools', href: '/categories/electric-other-tools' },
            { name: 'Sanders', href: '/categories/electric-sanders' },
            { name: 'Core Drill Machine', href: '/categories/core-drill-machine' },
            { name: 'Paint Mixer', href: '/categories/paint-mixer' },
            { name: 'Planner', href: '/categories/planner' },
            { name: 'Vibrators', href: '/categories/vibrators' },
            { name: 'Chainsaw', href: '/categories/electric-chainsaw' }
        ]
    },
    {
        name: 'Cordless Tools',
        subcategories: [
            { name: 'Grinders', href: '/categories/cordless-grinders' },
            { name: 'Drills', href: '/categories/cordless-drills' },
            { name: 'Wrenches', href: '/categories/cordless-wrenches' },
            { name: 'Circular Saw', href: '/categories/cordless-circular-saw' },
            { name: 'Rotary Hammer', href: '/categories/cordless-rotary-hammer' },
            { name: 'Blower', href: '/categories/cordless-blower' },
            { name: 'Micro Tiller', href: '/categories/micro-tiller' },
            { name: 'Sander', href: '/categories/cordless-sander' },
            { name: 'Chainsaw', href: '/categories/cordless-chainsaw' },
            { name: 'Other Tools', href: '/categories/cordless-other-tools' },
            { name: 'Combos', href: '/categories/cordless-combos' }
        ]
    },
    {
        name: 'Machine Tools',
        subcategories: [
            { name: 'Lathe Machine', href: '/categories/lathe-machine' },
            { name: 'Bench Grinders', href: '/categories/bench-grinders' },
            { name: 'Drill Press', href: '/categories/drill-press' },
            { name: 'Belt and Disc Sander', href: '/categories/belt-disc-sander' },
            { name: 'Mortise Machine', href: '/categories/mortise-machine' }
        ]
    },
    {
        name: 'Other Tools',
        subcategories: [
            { name: 'Tile Cutter', href: '/categories/tile-cutter' },
            { name: 'Table Saw', href: '/categories/table-saw' }
        ]
    },
    {
        name: 'Power Stations',
        href: '/categories/power-stations'
    },
    {
        name: 'Power Tools Accessories',
        href: '/categories/power-tools-accessories'
    },
    {
        name: 'Motorised Cut Off Machine',
        href: '/categories/motorised-cut-off-machine'
    },
    {
        name: 'Cut Off Machine',
        href: '/categories/cut-off-machine'
    },
    {
        name: 'Mitre Saw',
        href: '/categories/mitre-saw'
    }
];

type BadgeVariant = "sale" | "out_of_stock" | "featured" | null;

export interface Product {
    id: string;
    title: string;
    model?: string;
    price: number;
    image: string;
    badge?: BadgeVariant;
}

export const sampleProducts: Product[] = [
    {
        id: "1", title: "Cordless Drill", model: "CD-500", price: 120.99,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "featured"
    },
    {
        id: "2", title: "Angle Grinder", model: "AG-800", price: 95.49,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "sale"
    },
    {
        id: "3", title: "Circular Saw", model: "CS-1200", price: 210.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "4", title: "Reciprocating Saw", model: "RS-700", price: 150.75,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "5", title: "Impact Driver", model: "ID-300", price: 180.25,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "sale"
    },
    {
        id: "6", title: "Jigsaw", model: "JS-400", price: 110.5,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "7", title: "Heat Gun", model: "HG-150", price: 75.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "featured"
    },
    {
        id: "8", title: "Table Saw", model: "TS-2000", price: 550.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "9", title: "Bench Grinder", model: "BG-500", price: 130.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "10", title: "Planer", model: "PL-600", price: 220.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "out_of_stock"
    },
    {
        id: "11", title: "Belt Sander", model: "BS-400", price: 160.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "12", title: "Rotary Tool Kit", model: "RT-100", price: 89.99,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "sale"
    },
    {
        id: "13", title: "Cordless Nail Gun", model: "NG-250", price: 240.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "14", title: "Power Mixer", model: "PM-350", price: 199.99,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "15", title: "Oscillating Multi-Tool", model: "OMT-120", price: 140.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "featured"
    },
    {
        id: "16", title: "Tile Cutter", model: "TC-800", price: 185.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "17", title: "Concrete Drill", model: "CD-900", price: 320.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "sale"
    },
    {
        id: "18", title: "Power Router", model: "PR-500", price: 270.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    },
    {
        id: "19", title: "Cordless Leaf Blower", model: "LB-150", price: 150.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "featured"
    },
    {
        id: "20", title: "Electric Chainsaw", model: "EC-400", price: 350.0,
        image: "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg",
        badge: "out_of_stock"
    }
];
