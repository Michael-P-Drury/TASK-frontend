"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import styles from './sidebar.module.css';
import { LuFiles } from "react-icons/lu";


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Account', href: '/account', icon: MdOutlineAccountCircle },
    { name: 'Chat', href: '/', icon: CiChat1 },
    { name: 'User Files', href: '/user_files', icon: LuFiles }
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={styles.toggleBtn}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={styles.brand}>
        {!isCollapsed && <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>TASK</span>}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className={styles.navItem}>
            <item.icon size={24} />
            {!isCollapsed && <span className={styles.navText}>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}