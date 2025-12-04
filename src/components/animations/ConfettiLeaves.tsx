'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

export function ConfettiLeaves() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [leaves, setLeaves] = useState<number[]>([]);

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        // Create 30 leaves
        setLeaves(Array.from({ length: 30 }, (_, i) => i));
    }, []);

    if (dimensions.width === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {leaves.map((i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: -20,
                        x: Math.random() * dimensions.width,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        y: dimensions.height + 100,
                        x: Math.random() * dimensions.width + (Math.random() - 0.5) * 200,
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                        opacity: 0
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        ease: "linear",
                        delay: Math.random() * 0.5
                    }}
                    className="absolute"
                >
                    <Leaf
                        className="text-primary"
                        style={{
                            width: 20 + Math.random() * 20,
                            height: 20 + Math.random() * 20,
                            color: ['#4CAF50', '#2E7D32', '#8D6E63', '#FF9800'][Math.floor(Math.random() * 4)]
                        }}
                        fill="currentColor"
                    />
                </motion.div>
            ))}
        </div>
    );
}
