interface props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function NewsDetailLayout({ children, modal }: props) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
