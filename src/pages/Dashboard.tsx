import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface FileData {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);
      fetchFiles();
    });
  }, [navigate]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching files");
      return;
    }

    setFiles(data || []);
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("ixso-files")
      .download(filePath);

    if (error) {
      toast.error("Error downloading file");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("File downloaded successfully");
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gradient">IXSO Dashboard</h1>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Available Files</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{file.content_type || "N/A"}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => downloadFile(file.file_path, file.filename)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;