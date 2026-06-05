"use client"

import { motion, AnimatePresence } from "framer-motion"
import { removeFromWishlist } from "@/lib/wishlistActions"
import { addToCart } from "@/lib/cartActions"
import Image from "next/image"
import { Eyebrow, Heading, Button } from "@/components/ui/tcc"

export default function WishlistClient({ wishlist = [], products = [] }: any) {
  const wishlistItems = wishlist
    .map((item: any) => {
      const product = products.find(
        (p: any) => p.slug?.current === item.slug
      )
      return product ? product : null
    })
    .filter(Boolean)

  const productImages: any = {
    "Premium iWallet – White": {
      desktop: [
        "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/4-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
        "/Iwallet - Images/Prod image- desk -White/5-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/6-white.jpg"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-white/1-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/2-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/3-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/4-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/5-white.jpg"
      ]
    },
    "Premium iWallet – Black": {
      desktop: [
        "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/6-black.jpg"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-Black/1-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/3-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/5-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/6-black.jpg"
      ]
    },
    "Premium iWallet – Space Grey": {
      desktop: [
        "/Iwallet - Images/Prod image-desk-grey/1.png",
        "/Iwallet - Images/Prod image-desk-grey/2.png",
        "/Iwallet - Images/Prod image-desk-grey/3.png",
        "/Iwallet - Images/Prod image-desk-grey/4.png"
      ],
      mobile: [
        "/Iwallet - Images/Prod images- grey- mob/1.png",
        "/Iwallet - Images/Prod images- grey- mob/2.png",
        "/Iwallet - Images/Prod images- grey- mob/3.png",
        "/Iwallet - Images/Prod images- grey- mob/4.png"
      ]
    }
  };

  const getProductMedia = (product: any) => {
    let desktopImgs: string[] = [];
    let mobileImgs: string[] = [];

    if (productImages[product.title]) {
      desktopImgs = productImages[product.title].desktop || [];
      mobileImgs = productImages[product.title].mobile || [];
    } else {
      const imgs = product.images && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);
      desktopImgs = imgs;
      mobileImgs = imgs;
    }

    const mediaList = desktopImgs.map((img: string, i: number) => ({
      type: "image",
      desktop: img,
      mobile: mobileImgs[i] || img
    }));

    if (product.videoUrl) {
      mediaList.push({
        type: "video",
        desktop: product.videoUrl,
        mobile: product.videoUrl
      });
    }

    return mediaList;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface pt-32 md:pt-40 pb-16 px-4 md:px-8 text-primary flex flex-col items-center"
    >
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 md:mb-20"
        >
          <Eyebrow className="mb-4">YOUR CURATED FAVORITES</Eyebrow>
          <Heading as="h1">Wishlist<span className="text-brand">.</span></Heading>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100"
          >
            <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl md:text-6xl text-gray-200">♥</span>
            </div>
            <p className="text-gray-400 font-bold text-lg md:text-2xl mb-8">Your wishlist is empty.</p>
            <Button href="/buy" size="lg">EXPLORE PRODUCTS</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((product: any) => (
                <motion.div
                  layout
                  key={product.slug.current}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative bg-gray-50 p-2 md:p-6 overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full relative group/scroll">
                      {getProductMedia(product).map((media: any, i: number) => {
                        return (
                          <div key={i} className="min-w-full aspect-square relative flex items-center justify-center snap-center shrink-0 group">
                            {media.type === "video" ? (
                              <video
                                src={media.desktop}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="object-contain w-full h-full relative z-10"
                              />
                            ) : (
                              <>
                                {/* Desktop Image */}
                                <Image
                                  src={media.desktop}
                                  className="object-contain transform group-hover:scale-105 transition-transform duration-700 relative z-10 hidden md:block"
                                  alt={`${product.title} ${i + 1}`}
                                  fill
                                  unoptimized={true}
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                {/* Mobile Image */}
                                <Image
                                  src={media.mobile}
                                  className="object-contain transform group-hover:scale-105 transition-transform duration-700 relative z-10 block md:hidden"
                                  alt={`${product.title} ${i + 1}`}
                                  fill
                                  unoptimized={true}
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Visual Cue for scroll */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                       {getProductMedia(product).map((_: any, i: number) => (
                         <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                       ))}
                    </div>
                    <form 
                      action={removeFromWishlist.bind(null, product.slug.current)}
                      className="absolute top-4 right-4 md:top-6 md:right-6 z-10"
                    >
                      <button className="w-8 h-8 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all shadow-md font-bold">
                        ✕
                      </button>
                    </form>
                  </div>

                  <div className="p-6 md:p-10 flex flex-col flex-1">
                    <div className="flex-1 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 h-0.5 bg-brand rounded-full" />
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Premium Collection</p>
                      </div>
                      <h2 className="text-xl md:text-3xl font-black text-primary tracking-tight leading-none mb-2">
                        {product.title}
                      </h2>
                      <p className="text-xl md:text-2xl font-bold text-primary">₹{product.price || 1399}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <form action={addToCart.bind(null, product.slug.current)}>
                        <Button type="submit" fullWidth size="lg">ADD TO CART</Button>
                      </form>
                      <Button href={`/buy?product=${product.slug.current}`} variant="secondary" fullWidth>
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  )
}
