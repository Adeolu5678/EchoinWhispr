  const echoWhisper = useMutation(api.conversations.echoWhisper);

  /**
   * Handles sending a reply that creates a conversation
   */
  const handleReply = async () => {
    if (!replyContent.trim() || !whisper) return;

    setIsReplying(true);
    try {
      await echoWhisper({
        whisperId: whisper._id as Id<'whispers'>,
        replyContent: replyContent.trim(),
      });

      toast({
        title: 'Echo request sent!',
        description: 'Your conversation has been started.',
      });

      router.push('/conversations');
    } catch (error) {
      console.error('Failed to echo whisper:', error);
      toast({
        title: 'Failed to send reply',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReplying(false);
    }
  };

  /**
   * Copies the whisper content to the clipboard
   */
  const handleCopy = () => {
    if(!whisper) return;
    navigator.clipboard.writeText(whisper.content);
    toast({ title: 'Copied to clipboard!' });
  };

  const formattedTime = whisper
    ? formatDistanceToNow(new Date(whisper._creationTime), { addSuffix: true })
    : '';

  // The Convex backend already enforces that only recipients can access whispers
  const isRecipient: boolean = !!whisper;

  // Loading state skeleton matching the new design
  if (!whisper) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-primary/20 rounded-lg animate-pulse" />
            <div className="h-8 w-48 bg-primary/10 rounded-lg animate-pulse" />
          </div>
          
          <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-white/5 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Whisper Details</h1>
              <p className="text-muted-foreground text-sm">View and respond to this whisper</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Whisper Card */}
          <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50" />
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2.5 rounded-xl">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Anonymous Whisper</h2>
                    <p className="text-xs text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast({ title: "Feature coming soon!" })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90">
                  {whisper.content}
                </p>
              </div>

              {FEATURE_FLAGS.IMAGE_UPLOADS && whisper.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    alt="Whisper Image"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    src={whisper.imageUrl}
                    width={800}
                    height={600}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reply Section */}
          {isRecipient ? (
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send a Reply
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    maxLength={280}
                    className="min-h-[120px] bg-secondary/20 border-white/10 focus-visible:ring-primary resize-none pr-12"
                  />
                  {FEATURE_FLAGS.IMAGE_UPLOADS && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 hover:bg-white/10"
                      onClick={() => toast({ title: "Image upload coming soon!" })}
                    >
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {replyContent.length}/280 characters
                  </span>
                  <Button
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isReplying}
                    className="px-8"
                  >
                    {isReplying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Reply
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-3 text-yellow-500">
                <Shield className="w-5 h-5" />
                <p className="font-medium">You can only reply to whispers that were sent to you.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}