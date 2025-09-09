import Container from '@/lib/component/layout/container';
import { H4, P2 } from '@/lib/ui';
import React from 'react';

export default function NotFound() {
  return (
    <Container className="h-screen flex-row justify-center">
      <H4 className="mx-2">404</H4>
      <P2>| Not found</P2>
    </Container>
  );
}
