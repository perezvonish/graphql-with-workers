import postgres from 'postgres';

const db = postgres({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
});


export async function getReviewById(id: string) {
    const [review] = await db`
    SELECT id, text FROM reviews WHERE id = ${id}
  `;
    return review;
}

export async function updateReviewWithStatus(
  reviewId: string,
  updatedText: string,
  outboxId: string
) {
  await db.begin(async (tx) => {
    await tx`
      UPDATE reviews SET text = ${updatedText} WHERE id = ${reviewId}
    `;
    await tx`
      UPDATE outboxes SET status = 'DELIVERED' WHERE id = ${outboxId}
    `;
  });
}