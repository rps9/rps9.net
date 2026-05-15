import Header from '../components/Header';
import Slideshow from '../components/Slideshow';
import lakeBiwaImage from '../assets/about_lake_biwa.webp';
import quecheeImage from '../assets/about_quechee.webp';
import lakeWinniImage from '../assets/about_lake_winni.webp';
import fushimiImage from '../assets/about_fushimi.webp';

const travelPhotos = [
    { src: lakeBiwaImage, caption: 'Lake Biwa Boats' },
    { src: quecheeImage, caption: 'Quechee, Vermont' },
    { src: lakeWinniImage, caption: 'Lake Winnipesaukee' },
    { src: fushimiImage, caption: 'Fushimi Inari Shrine' },
];

export default function AboutMe() {
    return (
    <div className="site-shell">
    <Header />
        <section className="site-section min-h-[calc(100vh-4rem)]">
            <div className="site-container">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                    <div>
                        <p className="editorial-kicker">Background</p>
                        <h1 className="editorial-title mb-8">
                            About <span className="text-[#b21f2d]">Me</span>
                        </h1>
                        <div className="border-t border-black pt-8">
                            <div className="space-y-6">
                                <p className="text-lg leading-8 text-neutral-700">
                                    I'm a Computer Engineering student who has a passion for coding and machine learning. I enjoy automating certain things in my life and hosting as many things as I can for free. I am always diving into new projects, trying to learn as much as I can.
                                </p>
                                <p className="text-lg leading-8 text-neutral-700">
                                    Outside of school and work, I like to play basketball, travel, and try new things.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:pt-8">
                        <Slideshow slides={travelPhotos} />
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
}
