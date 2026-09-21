type LeadRow = {
  id: string;
  fullName: string;
  email: string;
  planName: string;
  createdAt: string;
};

type Props = {
  leads: LeadRow[];
};

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function LeadsTable({ leads }: Props) {
  if (!leads.length) {
    return (
      <p className="p-6 text-muted">No hay leads todavía con este filtro.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-subtle text-muted">
          <tr>
            <th className="px-4 py-3 font-bold">Fecha</th>
            <th className="px-4 py-3 font-bold">Nombre</th>
            <th className="px-4 py-3 font-bold">Email</th>
            <th className="px-4 py-3 font-bold">Plan</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-border">
              <td className="px-4 py-3 whitespace-nowrap text-muted">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3 text-foreground">{lead.fullName}</td>
              <td className="px-4 py-3">
                <a
                  href={`mailto:${lead.email}`}
                  className="font-bold text-primary hover:underline"
                >
                  {lead.email}
                </a>
              </td>
              <td className="px-4 py-3 text-foreground">{lead.planName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
