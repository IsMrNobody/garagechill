import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Play, Clock, Globe, Image as ImageIcon, Film, Lightbulb, ShoppingCart, X, Plus, Minus } from 'lucide-react';


const FOOD_VIDEOS = {
  HERO: '/001.mp4',
};

interface CartItem {
  title: string;
  price: string;
  image?: string;
  quantity: number;
}

export default function App() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const addToCart = (item: { title: string, price: string, image?: string }) => {
    setCart(prev => {
      const existing = prev.find(i => i.title === item.title);
      if (existing) {
        return prev.map(i => i.title === item.title ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (title: string) => {
    setCart(prev => prev.filter(i => i.title !== title));
  };

  const updateQuantity = (title: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.title === title) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const priceNum = parseFloat(item.price.replace('$', ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  const handleCheckout = () => {
    const phoneNumber = "584128352365";
    const message = `¡Hola! Me gustaría realizar el siguiente pedido en Garage Chilling:\n\n` +
      cart.map(item => `- ${item.quantity}x ${item.title} (${item.price})`).join('\n') +
      `\n\n*Total estimado: $${cartTotal}*\n\n¿Me podrían confirmar el tiempo de entrega?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const videoOpacity = useTransform(scrollY, [0, 500], [0.9, 0.1]);
  const videoY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <main className="bg-[#fcfcfc] text-[#1a1a1a] font-body selection:bg-brand-orange/30 relative">
      {/* Atmospheric Backgrounds */}
      <div className="fixed inset-0 orange-glow pointer-events-none" />
      <div className="fixed -top-40 -left-10 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-1 bg-black">
          <img src="/letra.png" alt="Logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center liquid-glass rounded-full px-2 py-1.5 gap-1 shadow-sm">
            <div className="flex items-center px-4 gap-6">
              {['Menú', 'Nosotros', 'Ubicación', 'Contacto'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 hover:text-brand-orange transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <button className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-brand-orange transition-all">
              Reservar Mesa ↗
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center text-black hover:text-brand-orange transition-colors relative shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-20">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          src={FOOD_VIDEOS.HERO}
          style={{
            scale: videoScale,
            opacity: videoOpacity,
            y: videoY
          }}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 w-[120%] h-[120%]"
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="liquid-glass rounded-full pr-4 pl-1.5 py-1 flex items-center gap-3 mb-8 shadow-sm"
          >
            <span className="bg-brand-orange text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight">Nuevo</span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-black/80">El sabor más Chilling de la ciudad</span>
          </motion.div>

          <motion.img
            initial={{ filter: 'blur(10px)', opacity: 0, scale: 0.8 }}
            animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            src="/logo.png"
            alt="Garage Chilling Logo"
            className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto mb-12 drop-shadow-2xl"
          />

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center text-black font-semibold max-w-xl text-lg leading-relaxed mb-16 liquid-glass px-8 py-4 rounded-3xl border border-yellow-400/30 shadow-xl backdrop-blur-md bg-yellow-400/20"
          >
            ¿Están listos para vivir la experiencia? Disfruta de nuestras hamburguesas, pepitos, almuerzos y más con el estilo único de Garage.
          </motion.p>



          {/* Stats Cards */}
          {/* <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-4">
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, x: -20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="liquid-glass w-56 p-6 rounded-3xl text-left shadow-sm"
            >
              <div className="text-brand-orange mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <div className="font-heading text-4xl text-black">3 Stars</div>
              <div className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Michelin Accreditation</div>
            </motion.div>
          </div>

          <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-4">
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, x: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="liquid-glass w-56 p-6 rounded-3xl text-left shadow-sm"
            >
              <div className="text-brand-orange mb-4">
                <Play className="w-8 h-8" />
              </div>
              <div className="font-heading text-4xl text-black">12 Courses</div>
              <div className="text-[10px] uppercase tracking-widest text-black/40 mt-1">The Infinite Tasting Series</div>
            </motion.div>
          </div> */}

          {/* Footer Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 inset-x-0 flex flex-col items-center"
          >
            {/* <div className="text-[9px] uppercase tracking-[0.4em] text-black/30 mb-4">Nuestros Aliados</div> */}
            <div className="flex gap-12 font-heading text-xl text-white/40">
              <span>Promos</span>
              <span>Pagos</span>
              <span>Ubicación</span>
              <span>Delivery</span>
              <span>Reserva</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu / Gastronomy Section */}
      <section id="menu" className="relative min-h-screen bg-[#fcfcfc] overflow-hidden py-32 px-8 lg:px-20">
        <img
          src="/bg.png"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          alt="Menu Background"
        />

        <div className="relative z-10">
          <div className="mb-20">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[11px] uppercase tracking-[0.4em] font-medium text-brand-orange mb-6 block"
            >
              // Gastronomía
            </motion.span>
            <motion.h2
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              className="font-heading italic text-black text-6xl md:text-8xl leading-[0.9] tracking-[-3px]"
            >
              Menú <br />
              <span className="text-brand-orange">Garage</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 text-left">
            <MenuCard
              image="/classic.png"
              icon={<ImageIcon className="w-5 h-5" />}
              tags={['Solomo/Pollo', 'Cheddar', 'Salsa Casa']}
              title="Classic"
              description="Pan de tu preferencia, carne solomo 75 Gr. o pollo crispy, queso cheddar, salsa de la casa y vegetales."
              price="6$"
              onAddToCart={() => addToCart({ title: 'Classic', price: '6$', image: '/classic.png' })}
            />
            <MenuCard
              image="/especial.png"
              icon={<Film className="w-5 h-5" />}
              tags={['Solomo/Pollo', 'Tocineta', 'Facilista']}
              title="Garage Especial"
              description="Pan de tu preferencia, carne solomo 150Gr o pollo crispy, facilista, tocineta, salsa de la casa y vegetales."
              price="8$"
              onAddToCart={() => addToCart({ title: 'Garage Especial', price: '8$', image: '/especial.png' })}
            />
            <MenuCard
              image="/crispy.png"
              icon={<Lightbulb className="w-5 h-5" />}
              tags={['Pollo Crispy', 'BBQ Miel', 'Pepinillos']}
              title="Crispy Honey"
              description="Pan de tu preferencia, pollo crispy 150Gr, doble facilista, tocineta, BBQ Miel, pepinillos, salsa de la casa y lechuga."
              price="8$"
              onAddToCart={() => addToCart({ title: 'Crispy Honey', price: '8$', image: '/crispy.png' })}
            />
            <MenuCard
              image="/chicken.png"
              icon={<ImageIcon className="w-5 h-5" />}
              tags={['Pollo Crispy', 'Tocineta', 'Coleslaw']}
              title="Chicken Burger"
              description="Pan de tu preferencia, pollo crispy, facilista, tocineta, pepinillos ensalada coleslaw y salsa de la casa."
              price="8$"
              onAddToCart={() => addToCart({ title: 'Chicken Burger', price: '8$', image: '/chicken.png' })}
            />
            <MenuCard
              image="/pork.png"
              icon={<Clock className="w-5 h-5" />}
              tags={['Smash 160g', 'Pullpork', 'Mozzarella']}
              title="Pullpork Burger"
              description="Pan de tu preferencia, carne smash 160Gr, pepinillos, salsa de la casa, queso facilista, mozzarella, coronado con pullpork Garage."
              price="12$"
              onAddToCart={() => addToCart({ title: 'Pullpork Burger', price: '12$', image: '/pork.png' })}
            />
            <MenuCard
              image="/ocean.png"
              icon={<Globe className="w-5 h-5" />}
              tags={['Solomo', 'Camarones', 'Ajo']}
              title="Ocean Burger"
              description="Pan de tu preferencia, carne solomo 150Gr, facilista, tocineta, camarones al ajillo o crispy, salsa de la casa y vegetales."
              price="11$"
              onAddToCart={() => addToCart({ title: 'Ocean Burger', price: '11$', image: '/ocean.png' })}
            />
          </div>
        </div>
      </section>

      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#fcfcfc] z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading italic text-4xl text-black">Tu Carrito</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center text-black hover:text-brand-orange transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p className="font-medium">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.title} className="flex gap-4 items-center liquid-glass p-4 rounded-2xl">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/5">
                          {item.image && <img src={item.image} className="w-full h-full object-cover" alt={item.title} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading italic text-xl leading-none mb-1">{item.title}</h4>
                          <span className="text-brand-orange font-bold">{item.price}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/5 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.title, -1)} className="p-1 hover:text-brand-orange"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.title, 1)} className="p-1 hover:text-brand-orange"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-black/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-black/40 uppercase tracking-widest text-[10px] font-black">Total estimado</span>
                    <span className="text-3xl font-heading italic text-brand-orange">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 rounded-full font-black uppercase tracking-tighter hover:bg-brand-orange transition-all shadow-lg"
                  >
                    Finalizar Pedido ↗
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function MenuCard({ image, icon, tags, title, description, price, onAddToCart }: {
  image?: string,
  icon: React.ReactNode,
  tags: string[],
  title: string,
  description: string,
  price: string,
  onAddToCart?: () => void
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="liquid-glass p-8 rounded-[2rem] flex flex-col min-h-[500px] text-left shadow-sm group border border-transparent hover:border-brand-orange/10 transition-all relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center text-brand-orange shadow-inner">
          {icon}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 max-w-[60%]">
          {tags.map(tag => (
            <span key={tag} className="bg-black/5 px-3 py-1 rounded-full text-[10px] font-medium text-black/60 whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {image && (
        <div className="w-full h-48 mb-6 overflow-hidden rounded-2xl relative z-10">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
      )}

      <div className="mt-auto relative z-10">
        <h3 className="font-heading italic text-4xl tracking-tighter leading-none mb-3 text-black">
          {title}
        </h3>
        <p className="text-sm text-black/60 font-light leading-snug max-w-[32ch] mb-6">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-heading italic text-brand-orange">{price}</span>
          <button
            onClick={onAddToCart}
            className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-brand-orange transition-colors"
          >
            Pedir Ahora ↗
          </button>
        </div>
      </div>
    </motion.div>
  );
}
