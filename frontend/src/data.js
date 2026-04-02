export const categoryData = {
  // BEDROOM SECTION
  'cots-and-beds': {
    name: 'Cots & Beds',
    accentName: 'Premium',
    heroImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80&fit=crop',
    label: 'Bedroom Elegance',
    description: 'Handcrafted from the finest solid wood. Designed to be the centerpiece of your sanctuary and built to last generation after generation.',
    products: [
      { id: 'cot-1', name: 'The Maharaja King Bed', material: 'Solid Teak Wood', badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=80&fit=crop', description: 'A magnificent king size bed featuring intricate hand-carved pillars and a grand upholstered headboard.',
        specs: { category: 'Cots & Beds', material: 'Solid Teak Wood', storage: 'None', assembly: 'Yes', color: 'Natural Teak Finish' } },
      { id: 'cot-2', name: 'Heritage Queen Cot', material: 'Rosewood Finish', badge: 'Classic', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80&fit=crop', description: 'Minimalist yet sturdy design showcasing deep, rich grains of premium timber.',
        specs: { category: 'Cots & Beds', material: 'Solid Teak Wood', storage: 'None', assembly: 'Yes', color: 'Rosewood Dark' } }
    ]
  },
  'king-size-beds': { 
    name: 'King Size Beds', 
    accentName: 'Majestic', 
    heroImage: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&q=80&fit=crop', 
    label: 'Grand Comfort',
    description: 'Spacious and grand. Our king size beds are masterpieces of comfort and style, built for the ultimate sleeping experience.',
    products: [
      { id: 'king-1', name: 'Royal Teak King Bed', material: 'Solid Teak Wood', badge: 'Signature', image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=80&fit=crop', description: 'Heavy solid teak construction with a hand-carved traditional headboard.',
        specs: { category: 'King Size Beds', material: 'Solid Teak Wood', storage: 'Optional Box', assembly: 'Yes', color: 'Golden Brown' } }
    ]
  },
  'queen-size-beds': { 
    name: 'Queen Size Beds', 
    accentName: 'Elegant', 
    heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&fit=crop', 
    label: 'Boutique Living',
    description: 'Perfectly sized for modern bedrooms. Our queen size beds provide the ideal balance between luxury and spatial efficiency.',
    products: [
        { id: 'queen-1', name: 'Heritage Queen Cot', material: 'Rosewood Finish', badge: 'Classic', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80&fit=crop', description: 'Minimalist yet sturdy design showcasing deep, rich grains of premium timber.',
          specs: { category: 'Queen Size Beds', material: 'Solid Teak Wood', storage: 'None', assembly: 'Yes', color: 'Walnut Finish' } }
    ]
  },
  'wardrobes': { 
    name: 'Wardrobes', 
    accentName: 'Bespoke', 
    heroImage: 'https://images.unsplash.com/photo-1595428774223-ef048827c5ec?w=1600&q=80&fit=crop', 
    label: 'Organized Luxury',
    description: 'Exquisite storage for your finest collections. Our solid wood wardrobes are designed to be as beautiful as the clothes they house.',
    products: [
      { id: 'ward-1', name: 'Grand Mansion Armoire', material: 'Solid Mahogany', badge: 'Customizable', image: 'https://images.unsplash.com/photo-1595428774223-ef048827c5ec?w=600&q=80&fit=crop', description: 'Four-door grand wardrobe with integrated drawers and full-length mirrors.',
        specs: { category: 'Wardrobes', material: 'Solid Mahogany', storage: '4 Drawers, 6 Shelves', assembly: 'No (Pre-assembled)', color: 'Mahogany Red' } }
    ]
  },
  'dressing-tables': { 
    name: 'Dressing Tables', 
    accentName: 'Artisan', 
    heroImage: 'https://images.unsplash.com/photo-1505693415958-4d5ec1706507?w=1600&q=80&fit=crop', 
    label: 'Personal Sanctuary',
    description: 'Reflect your style. Elegant dressing tables featuring premium mirrors, delicate carvings, and organized drawer spaces.',
    products: [
      { id: 'dress-1', name: 'Vintage Vanity Table', material: 'Seasoned Oak', badge: 'Handcrafted', image: 'https://images.unsplash.com/photo-1505693415958-4d5ec1706507?w=600&q=80&fit=crop', description: 'Oval mirror with three drawers and a matching cushioned stool.',
        specs: { category: 'Dressing Tables', material: 'Seasoned Oak', storage: '3 Drawers', assembly: 'Yes', color: 'Oak Natural' } }
    ]
  },
  'teapoy': {
    name: 'Teapoy',
    accentName: 'Artisan',
    heroImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1600&q=80&fit=crop',
    label: 'Coffee Table Elegance',
    description: 'The centerpiece of conversation. Our handcrafted teapoys combine functionality with exquisite wood textures.',
    products: [
      { 
        id: 'teapoy-a4', 
        name: 'Teapoy A4', 
        material: 'Seasoned Teak', 
        badge: 'In Stock', 
        image: 'https://images.unsplash.com/photo-1533633038734-2bcca63a3e92?w=900&q=80&fit=crop', 
        gallery: [
            'https://images.unsplash.com/photo-1533633038734-2bcca63a3e92?w=900&q=80&fit=crop',
            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=900&q=80&fit=crop',
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=900&q=80&fit=crop'
        ],
        description: 'Teapoy furniture is a type of furniture that has a unique design. It is typically used as a side table, but it can also be used as a display piece. It is often used to display ornaments and collectibles, but its place in a room can depend on the design of the piece.',
        specs: { category: 'Teapoy', material: 'Seasoned Teak', storage: 'None', assembly: 'No', color: 'Medium Teak' } 
      }
    ]
  },
  'pooja-unit': {
    name: 'Pooja Units',
    accentName: 'Sacred',
    heroImage: 'https://images.unsplash.com/photo-1621319011735-99d29729851a?w=1600&q=80&fit=crop',
    label: 'Spiritual Spaces',
    description: 'Divine structures carved with devotion. Our pooja units bring peace and sanctity to your home with traditional craftsmanship.',
    products: [
      { id: 'pooja-1', name: 'Temple-Style Mandapam', material: 'A-Grade Teak', badge: 'Handcarved', image: 'https://images.unsplash.com/photo-1621319011735-99d29729851a?w=600&q=80&fit=crop', description: 'Gopuram-style top with detailed floral engravings on pillars.',
        specs: { category: 'Pooja Unit', material: 'Teak Wood', storage: '2 Small Drawers', assembly: 'No (One-piece)', color: 'Gilded Gold / Teak' } }
    ]
  },
  'sofa-sets': {
    name: 'Sofa Sets',
    accentName: 'Luxury',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80&fit=crop',
    label: 'Living Spaces',
    description: 'Exceptional comfort meets artistic design. Our sofa sets anchor your living space with warmth, elegance, and durability.',
    products: [
      { id: 'sofa-1', name: 'Royal Velvet Sofa', material: 'Teak Wood Base', badge: 'Signature', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop', description: 'Deep seated comfort with premium velvet upholstery and solid teak legs.',
        specs: { category: 'Sofa Sets', material: 'Teak & Velvet', storage: 'None', assembly: 'No', color: 'Midnight Blue' } }
    ]
  },
  'swing': {
    name: 'Swings (Oonjal)',
    accentName: 'Heritage',
    heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80&fit=crop',
    label: 'Relaxation Reimagined',
    description: 'Traditional relaxation for modern homes. Graceful, strong, and beautifully finished wooden swings.',
    products: [
      { id: 'swing-1', name: 'Royal Teak Swing', material: 'Teak with Brass Chains', badge: 'Authentic', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&q=80&fit=crop', description: 'Heavy solid teak plank with 24K gold-plated brass chain links.',
        specs: { category: 'Swing', material: 'Teak Wood', storage: 'None', assembly: 'Yes', color: 'Traditional Varnish' } }
    ]
  },
  'dining-tables': {
    name: 'Dining Tables',
    accentName: 'Grand',
    heroImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80&fit=crop',
    label: 'Dining Hall',
    description: 'Create memories around masterpieces. Our dining tables are built to gather families and withstand the test of time.',
    products: [
      { id: 'dt-1', name: 'Palatial 8-Seater', material: 'Old Growth Teak', badge: 'Handcrafted', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop', description: 'A massive solid wood table top with traditional interlocking joinery.',
        specs: { category: 'Dining Tables', material: 'Solid wood', storage: 'None', assembly: 'Yes', color: 'Teak Natural' } }
    ]
  },
  'dining-chairs': {
    name: 'Dining Chairs',
    accentName: 'Ergonomic',
    heroImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1600&q=80&fit=crop',
    label: 'Seating Luxury',
    description: 'Elegance in every curve. Our dining chairs provide unparalleled support and complement your dining space perfectly.',
    products: [
      { id: 'dc-1', name: 'Regal Upholstered Chair', material: 'Solid Teak & Silk', badge: 'Premium', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80&fit=crop', description: 'Soft silk cushioning on hand-polished teak frames.',
        specs: { category: 'Dining Chairs', material: 'Teak & Fabric', storage: 'None', assembly: 'No', color: 'Cream / Beige' } }
    ]
  },
  'crockery-units': {
    name: 'Crockery Units',
    accentName: 'Ornate',
    heroImage: 'https://images.unsplash.com/photo-1595428774223-ef048827c5ec?w=1600&q=80&fit=crop',
    label: 'Showcase Excellence',
    description: 'Display your treasures with pride. Our crockery units offer ample storage and glass showcases framed in solid wood.',
    products: [
      { id: 'cu-1', name: 'Heritage Glass Cabinet', material: 'Rosewood', badge: 'Classic', image: 'https://images.unsplash.com/photo-1595428774223-ef048827c5ec?w=600&q=80&fit=crop', description: 'Grand multi-shelf unit with tempered glass panels and soft-close doors.',
        specs: { category: 'Crockery Units', material: 'Solid Wood & Glass', storage: 'Multiple Shelves', assembly: 'No', color: 'Dark Walnut' } }
    ]
  },
  'bar-cabinets': {
    name: 'Bar Cabinets',
    accentName: 'Exclusive',
    heroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80&fit=crop',
    label: 'Entertainment Hub',
    description: 'Elevate your evenings. Sophisticated wooden bar cabinets with integrated wine racks and glassware storage.',
    products: [
      { id: 'bc-1', name: 'Vintage Barrel Bar', material: 'Seasoned Teak', badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80&fit=crop', description: 'Hidden storage with slide-out counter space and integrated lighting.',
        specs: { category: 'Bar Cabinets', material: 'Teak Wood', storage: 'Wine Rack + Shelves', assembly: 'No', color: 'Rustic Oak' } }
    ]
  },
  // NEW CATEGORIES FOR HOME CARDS
  'timber-supply': {
    name: 'Timber Supply',
    accentName: 'Raw',
    heroImage: 'https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=1600&q=80&fit=crop',
    label: 'Premium Wood',
    description: 'Ethically sourced, high-quality timber for all your construction and furniture needs. Hand-selected for durability and grain quality.',
    products: [
      { id: 'ts-1', name: 'A-Grade Teak Logs', material: 'Premium Teak', badge: 'Wholesale', image: 'https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=600&q=80&fit=crop', description: 'Large diameter seasoned teak logs ready for sawing.' },
      { id: 'ts-2', name: 'Rosewood Planks', material: 'Seasoned Rosewood', badge: 'Limited', image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80&fit=crop', description: 'Perfectly seasoned rosewood planks with rich natural texture.' }
    ]
  },
  'custom-furniture': {
    name: 'Custom Furniture',
    accentName: 'Bespoke',
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80&fit=crop',
    label: 'Tailored Crafts',
    description: 'Your vision, our craftsmanship. We create unique furniture pieces tailored to your specific taste and space requirements.',
    products: [
      { id: 'cf-1', name: 'Modern Designer Desk', material: 'Walnut & Metal', badge: 'Unique', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop', description: 'A custom-built office desk with minimalist lines and integrated charging ports.' }
    ]
  },
  'wood-finishing': {
    name: 'Wood Finishing',
    accentName: 'Master',
    heroImage: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=80&fit=crop',
    label: 'Surface Perfection',
    description: 'Expert polishing, painting, and preservation services to give your old furniture a second life and a brilliant shine.',
    products: [
      { id: 'wf-1', name: 'High-Gloss PU Finish', material: 'Polyurethane', badge: 'Premium', image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80&fit=crop', description: 'Mirror-like scratch-resistant finish for high-wear surfaces.' }
    ]
  }
};

export const getProductById = (id) => {
    for (const key in categoryData) {
        const product = categoryData[key].products.find(p => p.id === id);
        if (product) return { ...product, categoryKey: key, categoryName: categoryData[key].name };
    }
    return null;
};
