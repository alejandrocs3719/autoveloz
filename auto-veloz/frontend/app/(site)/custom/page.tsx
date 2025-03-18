import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pagina de Jin",

    // other metadata
    description: "Esta página es una prueba hecha por Jin",
};

export default function CustomePage() {
    return (
        <>
        <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
            <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap">

                <div className="w-full px-4 lg:w-3/4">
                <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                            
                    <h1>¡Hola, mundo!</h1>
                    <p>Esta es una página personalizada hecha por Jin.</p>
                </div>
                </div>
            </div>
            </div>
        </section>
        </>
    );
}
