'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import TeacherPortalSidebar from '@/components/teacher-portal/teacherportal-sidebar';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  ClipboardList,
  ArrowRight,
  Calendar,
  Search,
  FileText,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

interface Assessment {
  _id: string;
  name: string;
  description: string;
  classId: string;
  teacherId: string;
  created_at: string;
}

export default function SeeAssessment() {
  const router = useRouter();
  const { AssesmentId } = useParams();

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  async function fetchAssessmentDetails() {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/get_assesments/${AssesmentId}`
      );

      console.log(response.data.data);
      setAssessments(response.data.data);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (AssesmentId) {
      fetchAssessmentDetails();
    }
  }, [AssesmentId]);

  const filtered = assessments.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
               <main
        className={`transition-all duration-300 min-h-screen ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* ── Header ── */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-medium tracking-wide uppercase">
            <BookOpen size={12} />
            <span>Teacher Portal</span>
            <ChevronRight size={12} />
            <span className="text-slate-600">Assessments</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                <ClipboardList size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Assessment List
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {loading ? '—' : `${assessments.length} total assessments`}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Search assessments…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-white border-slate-200 rounded-xl text-sm shadow-sm focus-visible:ring-violet-400"
              />
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              {
                label: 'Total',
                value: assessments.length,
                icon: <FileText size={14} />,
                color: 'text-violet-600 bg-violet-50',
              },
              {
                label: 'This Month',
                value: assessments.filter((a) => {
                  const d = new Date(a.created_at);
                  const now = new Date();
                  return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                  );
                }).length,
                icon: <Calendar size={14} />,
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                label: 'Showing',
                value: filtered.length,
                icon: <ClipboardList size={14} />,
                color: 'text-indigo-600 bg-indigo-50',
              },
            ].map((s) => (
              <Card
                key={s.label}
                className="border border-slate-100 shadow-sm rounded-2xl"
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 leading-none">
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Table card ── */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-slate-100 bg-white">
            <p className="text-sm font-semibold text-slate-600">
              All Assessments
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <Skeleton className="h-4 w-40 rounded-lg" />
                    <Skeleton className="h-4 flex-1 rounded-lg" />
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <ClipboardList size={40} className="mb-3 opacity-30" />
                <p className="font-medium text-sm">No assessments found</p>
                <p className="text-xs mt-1">
                  Try adjusting your search query
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                      Description
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                      Created
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((item, idx) => (
                    <TableRow
                      key={item._id}
                      className="group hover:bg-violet-50/40 transition-colors border-slate-100"
                    >
                      {/* Name */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">
                            {item.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-500 truncate">
                          {item.description}
                        </p>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium text-slate-500 border-slate-200 bg-white gap-1.5 rounded-lg px-2.5 py-1"
                        >
                          <Calendar size={11} />
                          {new Date(item.created_at).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/teacherportal/grading/viewAssesment/${item._id}`
                            )
                          }
                          className="h-8 px-3.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-sm shadow-violet-200 transition-all gap-1.5 group-hover:shadow-md group-hover:shadow-violet-200"
                        >
                          View
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}