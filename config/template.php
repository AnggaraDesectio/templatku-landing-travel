<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-travel".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-travel'),

    'flavors' => array (
  'landing-travel' => 
  array (
    'label' => 'JELAJAH NUSA TRAVEL — Travel',
    'brand_name' => 'JELAJAH NUSA TRAVEL',
    'brand_tagline' => 'Indonesia itu indah. Ayo jelajahi!',
    'brand_initials' => 'JN',
    'accent' => '#0ea5e9',
    'category' => 'jasa',
    'home' => 'landings.travel',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/travel',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
