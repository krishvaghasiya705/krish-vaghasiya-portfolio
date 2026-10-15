import React from 'react'
import styles from "./mousewheel.module.scss"

export default function MouseWheel() {
    return (
        <>
            <div className={styles.mousewheel}>
                <div className={styles.wheel}></div>
            </div>
        </>
    )
}
