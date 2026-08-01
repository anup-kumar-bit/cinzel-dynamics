import React from 'react'
import Image from 'next/image'

// -------** HeroSection **---------
export default function HeroSection() {
    return (
        <section id="hero" className="relative isolate overflow-hidden px-4 pt-16 pb-4 sm:px-8 sm:pt-20 lg:px-16">
            <HeroBackdrop />
            <HeadingHero />
            <HeroGraphic />
        </section>
    )
}

// ---------- Animated gradient backdrop ----------
function HeroBackdrop() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="hero-wash animate-gradient-pan motion-reduce:animate-none absolute inset-0" />
            <div className="animate-aurora-a motion-reduce:animate-none absolute top-[6%] left-[20%] h-[85%] w-[46%] rounded-full bg-blue-400/22 blur-[90px] dark:bg-blue-500/14" />
            <div className="animate-aurora-b motion-reduce:animate-none absolute top-[14%] right-[2%] h-[90%] w-[42%] rounded-full bg-violet-400/18 blur-[100px] dark:bg-violet-500/14" />
            <div className="animate-aurora-c motion-reduce:animate-none absolute bottom-[-35%] left-[30%] h-[85%] w-[50%] rounded-full bg-sky-300/27 blur-[110px] dark:bg-sky-500/9" />
            <div className="animate-aurora-d motion-reduce:animate-none absolute top-[38%] right-[6%] h-[65%] w-[40%] rounded-full bg-emerald-300/40 blur-[90px] dark:bg-emerald-500/18" />
            <div className="animate-aurora-f motion-reduce:animate-none absolute top-[8%] left-[38%] h-[75%] w-[42%] rounded-full bg-pink-300/31 blur-[95px] dark:bg-pink-500/14" />
            <div className="animate-aurora-e motion-reduce:animate-none absolute top-[20%] left-0 h-[70%] w-[36%] rounded-full bg-[#5b1a63]/90 blur-[100px] dark:bg-[#7a2d84]/90" />
            <div className="hero-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent via-base-100/70 to-base-100 sm:h-56" />
        </div>
    )
}

// ---------- Heading of Hero Section ---------
function HeadingHero() {
    return (
        <div id='top' className="container mx-auto flex flex-col items-center text-center">
            <h1 className="font-cinzel text-3xl leading-tight font-extrabold tracking-tight text-base-content uppercase sm:text-4xl md:text-6xl">
                Building scalable backends.
                <br />
                Engineering flawless web apps.
            </h1>
            <p className="font-opensans mt-5 max-w-xl text-sm text-base-content/60 sm:text-base">
                We partner with startups to architect and build robust digital foundations that scale. Verified results, proven expertise.
            </p>
        </div>
    )
}

// ---------- Graphic of Hero Section -------------

const SATELLITE_NODES = [
    { src: '/svgs/avatar.svg', w: 1536, h: 1024, label: 'API', box: 'left-[23%] top-[13.93%] w-[16.3%]' },
    { src: '/svgs/table2.svg', w: 1403, h: 1121, label: 'Dashboards', box: 'left-[76.3%] top-[14.38%] w-[14.6%]' },
    { src: '/svgs/api.svg', w: 1774, h: 887, box: 'left-[12.85%] top-[50%] w-[24.9%]' },
    { src: '/svgs/db.svg', w: 2059, h: 764, box: 'left-[86.3%] top-[50%] w-[26.6%]' },
    { src: '/svgs/table.svg', w: 1415, h: 1111, label: 'Data Tables', box: 'left-[23%] top-[81.8%] w-[14.6%]' },
    { src: '/svgs/workflow.svg', w: 1254, h: 1254, label: 'Workflows', box: 'left-[76.3%] top-[80.22%] w-[12.8%]' },
]

const SPOKES = [
    { id: 's1', d: 'M 322 108 C 356 118 390 126 414 150' },  
    { id: 's2', d: 'M 266 222 L 386 222' },                   
    { id: 's3', d: 'M 314 340 C 350 332 390 320 414 295' },   
    { id: 's4', d: 'M 586 150 C 610 126 645 118 679 108' }, 
    { id: 's5', d: 'M 614 222 L 719 222' },                 
    { id: 's6', d: 'M 586 295 C 610 320 652 332 688 340' }, 
]

const NODE_LINKS = [
    { id: 'n1', d: 'M 55 156 Q 95 108 144 88' },   
    { id: 'n2', d: 'M 55 289 Q 95 336 150 350' },  
    { id: 'n3', d: 'M 847 92 Q 890 122 890 165' },  
    { id: 'n4', d: 'M 890 280 Q 890 315 838 330' }, 
]

function HeroGraphic() {
    return (
        <div id='mid' className="container mx-auto mt-10 mb-4 sm:mt-14 lg:mt-14">
            <div className="relative mx-auto aspect-1000/445 w-full max-w-4xl">
                <svg
                    viewBox="0 0 1000 445"
                    className="absolute inset-0 h-full w-full text-black"
                    fill="none"
                    aria-hidden="true"
                >
                    <defs>
                        <marker id="hero-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                            <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
                        </marker>
                    </defs>

                    {[...SPOKES, ...NODE_LINKS].map((c) => (
                        <path
                            key={c.id}
                            d={c.d}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            markerEnd="url(#hero-arrow)"
                        />
                    ))}
                </svg>

                {SATELLITE_NODES.map((node, i) => (
                    <div key={node.src} className={`absolute -translate-x-1/2 -translate-y-1/2 ${node.box}`}>
                        <div
                            className="animate-node-float motion-reduce:animate-none overflow-hidden rounded-md border border-slate-900/10 bg-white shadow-md shadow-slate-900/10 sm:rounded-lg lg:rounded-xl"
                            style={{ animationDelay: `${i * 0.45}s` }}
                        >
                            <Image
                                src={node.src}
                                alt=""
                                width={node.w}
                                height={node.h}
                                className="h-auto w-full"
                            />
                        </div>
                        {node.label && (
                            <span className="font-opensans absolute top-full left-1/2 mt-0.5 -translate-x-1/2 text-[7px] whitespace-nowrap text-base-content/55 sm:mt-1 sm:text-[9px] lg:text-[11px]">
                                {node.label}
                            </span>
                        )}
                    </div>
                ))}

                <div className="absolute left-1/2 top-1/2 w-[18.9%] -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-hero-glow motion-reduce:animate-none absolute inset-[-38%]rounded-full bg-blue-300/40 blur-2xl dark:bg-blue-500/18" />
                    <div className="relative overflow-hidden rounded-full border border-slate-900/10 bg-white shadow-xl shadow-slate-900/15">
                        <Image
                            src="/svgs/logoA.svg"
                            alt="Cinzel Dynamics"
                            width={1254}
                            height={1254}
                            className="h-auto w-full object-cover"
                            preload
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

