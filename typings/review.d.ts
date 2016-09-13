interface Review {
  frame?: number;
  comments?: [{
    user?: string,
    comment?: string,
    strokes?: [{      
      pts?: []
    }]
  }];
}