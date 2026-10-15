import React from 'react'
import styles from "./herobanner.module.scss"
import MouseWheel from '@/components/mousewheel'
import Image from 'next/image'
import HeroBannerImage from "../../../../public/assets/images/herobanner-portrait.png"

export default function Herobanner() {
    return (
        <>
            <section className={styles.herobanner}>
                <div className={styles.herobannerimg}>
                    <Image src={HeroBannerImage} alt='HeroBannerImage' />
                </div>
                <MouseWheel />
            </section>
        </>
    )
}
