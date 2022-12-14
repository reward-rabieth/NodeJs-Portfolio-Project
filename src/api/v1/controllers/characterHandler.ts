import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { logger } from '../../../utils/logger';

export async function characterHandler(request: any, reply: any) {
  try {
    const Id = request.params.id;

    const contents = `https://swapi.dev/api/films/${Id}/?format=json`;

    const { data } = await axios.get(contents);
    console.log(data);
    const results = data.characters;

    const characterUrl = results.map((url: string) => {
      return axios.get(url);
    });

    const characterData = await Promise.all(characterUrl);

    const characters = characterData.map((character: any) => {
      reply.send(character.data);
    });

    return reply.send(results);
  } catch (e) {
    logger.error(e, 'createFilmHandler:error from getting characters');
    return reply
      .code(400)
      .send({ message: 'Error from getting getting characters' });
  }
}
