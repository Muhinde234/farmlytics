// src/utils/constants.js

// --- Geographical Mappings ---
const province_mapping = {
    1: 'Kigali City', 2: 'Southern Province', 3: 'Western Province',
    4: 'Northern Province', 5: 'Eastern Province'
};

const district_mapping = {
    11: 'Nyarugenge', 12: 'Gasabo', 13: 'Kicukiro',
    21: 'Nyanza', 22: 'Gisagara', 23: 'Nyaruguru', 24: 'Huye',
    25: 'Nyamagabe', 26: 'Ruhango', 27: 'Muhanga',
    28: 'Kamonyi',
    31: 'Karongi', 32: 'Ngororero', 33: 'Nyabihu', 34: 'Rubavu',
    35: 'Rusizi', 36: 'Nyamasheke', 37: 'Rutsiro',
    41: 'Burera', 42: 'Gakenke', 43: 'Gicumbi', 44: 'Musanze',
    45: 'Rulindo',
    51: 'Bugesera', 52: 'Gatsibo', 53: 'Kayonza', 54: 'Kirehe',
    55: 'Ngoma', 56: 'Nyagatare', 57: 'Rwamagana'
};

// --- MVP Crop List & Maturity Days ---
const mvp_crops_list = [
    { name: "Maize", averageMaturityDays: 120 },
    { name: "Beans", averageMaturityDays: 90 },
    { name: "Irish potatoes", averageMaturityDays: 100 },
    { name: "Cassava", averageMaturityDays: 365 },
    { name: "Tomatoes", averageMaturityDays: 75 }
];

module.exports = {
    province_mapping,
    district_mapping,
    mvp_crops_list
};