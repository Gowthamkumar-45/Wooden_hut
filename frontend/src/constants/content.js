const WHATSAPP_NUMBER = "9259400700";

export const SITE_CONTENT = {
    brand: {
        name: "Marutham",
        subName: "Timbers & Furnitures",
        fullName: "Marutham Timbers & Furnitures",
        tagline: "Where Timber Becomes Legacy",
        est: "Est. with Pride",
        experience: "25+ Years",
        projectsLine: "1200+ Projects Delivered",
        promise: "100% Solid Wood Promise"
    },
    api: {
        base: "http://localhost:8000",
        media: "http://localhost:8000"
    },
    contact: {
        email: "marutham@gmail.com",
        phone: "+91 90034 61125",
        whatsapp: WHATSAPP_NUMBER,
        workingHours: "Mon – Sat: 9:00 AM – 7:00 PM",
        sunday: "Sunday: By Appointment"
    },
    locations: [
        {
            id: 'ottangadu',
            name: "Ottangadu",
            type: "Retail Showroom",
            address1: "205/10G,",
            address2: "Ottangadu Main road Pattukkottai,",
            cityZip: "Tamil Nadu 614803",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.078792571251!2d79.24205397509422!3d10.344093389779584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0005f0a5a8abed%3A0xe3f14e213f1a0e76!2sSri%20Sabari%20SawMill%20Timbers%20and%20Furnitures%20(Wholesale%20and%20Retail%20furniture)!5e1!3m2!1sen!2sin!4v1774947135582!5m2!1sen!2sin"
        },
        {
            id: 'chettipalayam',
            name: "Chettipalayam",
            type: "Factory & Retail Showroom",
            address1: "9W2GM+RRX,",
            address2: "Chettipalayam,",
            cityZip: "Tamil Nadu 641201",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.4888247989716!2d77.03176587510232!3d10.927070189231008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8510023eac3a3%3A0x551c834acc9211b9!2sMarutham%20Timbers%20and%20Furnitures%20(wholesale%20and%20retail)!5e1!3m2!1sen!2sin!4v1774947284937!5m2!1sen!2sin"
        }
    ],
    social: {
        facebook: "#",
        instagram: "#",
        whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`
    }
};

export const NAV_LINKS = [
    { name: "Home", path: "/" },
    { name: "Furniture Making", path: "/furniture-making" },
    { name: "Media", path: "/media" },
    { name: "Reviews", path: "/reviews" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" }
];

export const PRODUCTS_MENU = {
    living: [
        { name: "Pooja Unit", path: "/category/pooja-unit" },
        { name: "Teapoy", path: "/category/teapoy" },
        { name: "Storage Unit", path: "/category/pooja-unit" },
        { name: "Swing", path: "/category/swing" },
        { name: "Bed Side Table", path: "/category/pooja-unit" },
        { name: "TV Unit", path: "/category/pooja-unit" }
    ],
    dining: [
        { name: "Dining Table Sets", path: "/category/dining-tables" },
        { name: "Dining Chairs", path: "/category/dining-chairs" },
        { name: "Crockery Units", path: "/category/crockery-units" },
        { name: "Bar Cabinets", path: "/category/bar-cabinets" }
    ],
    bedroom: [
        { name: "King Size Beds", path: "/category/king-size-beds" },
        { name: "Queen Size Beds", path: "/category/queen-size-beds" },
        { name: "Wardrobes", path: "/category/wardrobes" },
        { name: "Dressing Tables", path: "/category/dressing-tables" }
    ]
};
