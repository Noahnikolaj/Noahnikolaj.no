/*
 * Paint worklet: the mask for the incoming view.
 *
 * It draws one rectangle per block, row by row.
 *
 * Rows go strictly one at a time: a row never starts until the one before it
 * has finished. They are ordered by how far they sit from the click, so the
 * row you pressed on goes first and the rest peel away above and below it.
 *
 * Within a row each block is hinged on the edge facing the click column and
 * swings open away from it, so the row parts outwards from the point you
 * pressed. Opening from the centre looked like the block was growing rather
 * than turning.
 *
 * Used as a mask on the incoming page, that reads as each block turning over
 * while the outgoing page stays visible underneath in the gaps.
 *
 * Opaque means visible, so everything here is painted black.
 */
registerPaint(
  "pixelFlip",
  class {
    static get inputProperties() {
      return [
        "--flip-progress",
        "--flip-x",
        "--flip-y",
        "--flip-block",
      ];
    }

    paint(ctx, size, props) {
      const progress = parseFloat(props.get("--flip-progress")) || 0;
      const originX = parseFloat(props.get("--flip-x")) || 0;
      const originY = parseFloat(props.get("--flip-y")) || 0;
      const block = parseFloat(props.get("--flip-block")) || 64;

      if (progress <= 0) return;
      if (progress >= 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, size.width, size.height);
        return;
      }

      const cols = Math.ceil(size.width / block);
      const rows = Math.ceil(size.height / block);

      /*
       * Rank the rows by distance from the click, so the row under your
       * finger turns first and the rest follow outwards. Each row owns an
       * equal, non-overlapping slice of the run.
       */
      const order = [];
      for (let row = 0; row < rows; row++) {
        order.push({ row, away: Math.abs((row + 0.5) * block - originY) });
      }
      order.sort((a, b) => a.away - b.away || a.row - b.row);

      const rank = new Array(rows);
      for (let i = 0; i < order.length; i++) rank[order[i].row] = i;

      const slice = 1 / rows;
      ctx.fillStyle = "black";

      for (let row = 0; row < rows; row++) {
        const begins = rank[row] * slice;
        const turn = Math.min(1, Math.max(0, (progress - begins) / slice));
        if (turn <= 0) continue;

        const top = row * block;

        if (turn >= 1) {
          ctx.fillRect(0, top, size.width, block);
          continue;
        }

        for (let col = 0; col < cols; col++) {
          const px = (col + 0.5) * block;
          const left = col * block;
          const w = block * turn;
          // Left of the click opens leftwards, right of it opens rightwards.
          const x = px >= originX ? left : left + block - w;
          ctx.fillRect(x, top, w, block);
        }
      }
    }
  },
);
