
import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';

export default function StandingsTable({ distros, groupName }) {
  const sortedDistros = [...distros].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent" />
        Classificação - Grupo {groupName}
      </h3>
      <div className="rounded-xl border-2 border-border overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-16 text-center font-bold">Pos</TableHead>
              <TableHead className="font-bold">Distro</TableHead>
              <TableHead className="text-center font-bold">Vitórias</TableHead>
              <TableHead className="text-center font-bold">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDistros.map((distro, index) => {
              const isQualified = index < 2;
              return (
                <motion.tr
                  key={distro.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${isQualified ? 'bg-primary/10 font-semibold' : ''} hover:bg-muted/50 transition-colors`}
                >
                  <TableCell className="text-center font-bold">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{distro.flag}</span>
                      <span className="font-medium">{distro.name}</span>
                      {isQualified && (
                        <Trophy className="w-4 h-4 text-accent ml-auto" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{distro.wins}</TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    {distro.points}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {sortedDistros.length > 0 && (
        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          Os 2 primeiros colocados se classificam para as oitavas de final
        </p>
      )}
    </div>
  );
}
