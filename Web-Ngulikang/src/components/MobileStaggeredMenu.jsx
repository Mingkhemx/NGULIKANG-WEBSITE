import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const MobileStaggeredMenu = ({ isOpen, onClose, onNavigate }) => {
    const { user, isAuthenticated, logout } = useUser();
    // Menu Data based on Header.jsx
    const menuItems = [
        { id: 'home', label: 'Home', type: 'link' },
        {
            id: 'search',
            label: 'Cari Tukang',
            type: 'dropdown',
            children: [
                { id: 'nguli-borongan', label: 'Nguli Borongan' },
                { id: 'nguli-harian', label: 'Nguli Harian' },
                { id: 'nguli-korporate', label: 'Nguli Korporate' },
                { id: 'nguli-premium', label: 'Nguli Premium' },
                { id: 'nguli-renovasi', label: 'Nguli Renovasi' },
                { id: 'bangun-baru', label: 'Bangun Baru' }
            ]
        },
        {
            id: 'create',
            label: 'Ciptakan Pekerjaan',
            type: 'dropdown',
            children: [
                { id: 'job-terms', label: 'Syarat & Ketentuan' },
                { id: 'job-register', label: 'Daftar Kerja' }
            ]
        },
        { id: 'marketplace', label: 'Marketplace', type: 'link' },
        { id: 'chat', label: 'Chat Tukang', type: 'link' },
        { id: 'blog', label: 'Blog', type: 'link' },
        { id: 'cek-status-lamaran', label: 'Cek Status Lamaran', type: 'link' },
    ];

    // Animation Variants
    const sidebarVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    // Use createPortal to move the menu to document.body, escaping z-index issues
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 19999 // Higher than LiveChat (9999)
                        }}
                    />

                    {/* Menu Content */}
                    <motion.div
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '350px',
                            height: '100vh',
                            backgroundColor: '#18181b', // Zinc-950
                            borderLeft: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '80px 40px 40px 40px',
                            zIndex: 20000, // Highest priority
                            overflowY: 'auto'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '30px',
                                right: '30px',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer',
                                zIndex: 20001
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {menuItems.map((item, idx) => (
                                <MenuItem
                                    key={idx}
                                    item={item}
                                    variants={itemVariants}
                                    onNavigate={onNavigate}
                                    onClose={onClose}
                                />
                            ))}
                        </div>

                        {/* Footer / Profile \u0026 Auth Area */}
                        <motion.div
                            variants={itemVariants}
                            style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            {/* Profile Avatar Section */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '20px',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px'
                            }}>
                                {/* Avatar */}
                                <div
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            onNavigate('profile');
                                            onClose();
                                        }
                                    }}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '2px solid #FF8C42',
                                        cursor: isAuthenticated ? 'pointer' : 'default',
                                        flexShrink: 0
                                    }}
                                >
                                    {user && user.avatar ? (
                                        <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255,140,66,0.2)'
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {isAuthenticated ? (user?.name || 'User') : 'Guest'}
                                    </div>
                                    <div style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '0.85rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {isAuthenticated ? (user?.email || '') : 'Belum login'}
                                    </div>
                                </div>
                            </div>

                            {/* Auth Button */}
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        onNavigate('home');
                                        onClose();
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,140,66,0.5)',
                                        color: '#FF8C42',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Keluar
                                </button>
                            ) : (
                                <button
                                    onClick={() => { onNavigate('login'); onClose(); }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: '#FF8C42',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Masuk / Daftar
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

const MenuItem = ({ item, variants, onNavigate, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (item.type === 'dropdown') {
        return (
            <motion.div variants={variants} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {item.label}
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        style={{ fontSize: '1rem', opacity: 0.7 }}
                    >
                        ▼
                    </motion.span>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden', marginLeft: '10px', marginTop: '10px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '10px' }}>
                                {item.children.map((child, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => { onNavigate(child.id); onClose(); }}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '1.1rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {child.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={variants}
            onClick={() => { onNavigate(item.id); onClose(); }}
            style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                cursor: 'pointer'
            }}
        >
            {item.label}
        </motion.div>
    );
};

export default MobileStaggeredMenu;
