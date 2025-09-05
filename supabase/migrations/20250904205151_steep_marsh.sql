/*
  # Add Mock Tech Products

  1. Sample Data
    - Adds 12 realistic tech products with proper descriptions and pricing
    - Includes laptops, smartphones, accessories, and gaming equipment
    - Uses high-quality Pexels images for product photos

  2. Data Structure
    - Each product has name, description, price, and image_url
    - Prices range from $29 to $2,999 for variety
    - Descriptions are detailed and marketing-focused
*/

-- Insert mock tech products
INSERT INTO products (name, description, price, image_url) VALUES
(
  'MacBook Pro 16" M3 Max',
  'The most powerful MacBook Pro ever. Built for professionals who push the limits of what''s possible. Features the revolutionary M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life.',
  2999.00,
  'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'
),
(
  'iPhone 15 Pro Max',
  'The ultimate iPhone experience. Forged in titanium with the powerful A17 Pro chip, advanced camera system, and Action Button. Capture stunning photos and videos with professional-grade capabilities.',
  1199.00,
  'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Gaming Beast RTX 4080 Desktop',
  'Unleash ultimate gaming performance with this custom-built gaming rig. Features NVIDIA RTX 4080, Intel i7-13700K, 32GB DDR5 RAM, and RGB lighting. Dominate every game at 4K resolution.',
  1899.00,
  'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Dell XPS 13 Plus',
  'Ultra-portable powerhouse for professionals on the go. Features 13th Gen Intel processors, stunning InfinityEdge display, and premium carbon fiber build. Perfect for productivity anywhere.',
  1299.00,
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'iPad Pro 12.9" M2',
  'The most advanced iPad ever. With the M2 chip, Liquid Retina XDR display, and support for Apple Pencil. Transform your workflow with desktop-class performance in a portable design.',
  1099.00,
  'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Sony WH-1000XM5 Headphones',
  'Industry-leading noise cancellation meets premium sound quality. Features 30-hour battery life, multipoint connection, and crystal-clear call quality. Your perfect audio companion.',
  399.00,
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Samsung Galaxy S24 Ultra',
  'The ultimate Android flagship. Features S Pen, 200MP camera with AI enhancement, titanium build, and Galaxy AI. Capture, create, and connect like never before.',
  1299.00,
  'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Apple Watch Series 9',
  'Your most powerful personal device. Features the new S9 chip, Double Tap gesture, and advanced health monitoring. Stay connected, motivated, and healthy every day.',
  399.00,
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Nintendo Switch OLED',
  'Play at home or on the go with the Nintendo Switch OLED model. Features a vibrant 7-inch OLED screen, enhanced audio, and 64GB internal storage. Gaming freedom redefined.',
  349.00,
  'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'AirPods Pro (2nd Gen)',
  'Immersive audio experience with adaptive transparency and personalized spatial audio. Features H2 chip, improved Active Noise Cancellation, and up to 6 hours of listening time.',
  249.00,
  'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Logitech MX Master 3S',
  'The world''s most advanced mouse for power users. Features ultra-precise scrolling, customizable buttons, and works on any surface including glass. Boost your productivity instantly.',
  99.00,
  'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Anker PowerCore 26800',
  'Ultra-high capacity portable charger with PowerIQ technology. Charge your devices multiple times with fast-charging capabilities. Never run out of power when you need it most.',
  79.00,
  'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=800'
);