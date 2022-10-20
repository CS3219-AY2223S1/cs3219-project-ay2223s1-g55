import { useRouter } from 'next/router';
import { EditRoad } from '@mui/icons-material';
import { Card, Grid, CardContent } from '@mui/material';
import Editor from '@/components/collaboration-platform/editor';

export default function CollaborationPlatform() {
  const router = useRouter();
  const { id: sessionId }: { id?: string } = router.query;
  return (
    <div style={{ padding: 40 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card elevation={3} sx={{ p: 2 }}>
            <CardContent>
              <Editor sessionId={sessionId ?? ''} />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card sx={{ m: 3 }}>Messaging system </Card>
        </Grid>
      </Grid>
    </div>
  );
}
