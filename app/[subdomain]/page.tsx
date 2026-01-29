'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import MysitePage from '../../app/mysite/page';

export default function SubdomainPage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;

  useEffect(() => {
    console.log('SubdomainPage - Subdomain:', subdomain);
  }, [subdomain]);

  // Render the mysite page for the subdomain
  return <MysitePage />;
}
